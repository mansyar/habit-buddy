import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth_store';
import { useBuddyStore } from '@/store/buddy_store';
import { useMissionTimer } from '@/components/useMissionTimer';
import { TimerDisplay } from '@/components/TimerDisplay';
import { BuddyAnimation } from '@/components/BuddyAnimation';
import { FloatingProp } from '@/components/FloatingProp';
import { Confetti } from '@/components/Confetti';
import { AppColors } from '@/theme/Colors';
import { audioService } from '@/lib/audio_service';
import { AUDIO_ASSETS } from '@/constants/audio';
import { Volume2, VolumeX, Zap } from 'lucide-react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { habitLogService } from '@/lib/habit_log_service';
import { ScaleButton } from '@/components/ScaleButton';

const HABIT_CONFIG: Record<string, { name: string; duration: number }> = {
  'tooth-brushing': { name: 'Brush Your Teeth', duration: 2 },
  'meal-time': { name: 'Eat Your Meal', duration: 15 },
  'toy-cleanup': { name: 'Pick Up Toys', duration: 5 },
};

export default function MissionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = React.useRef(false);

  const {
    state: buddyState,
    startMission: setBuddyActive,
    pauseMission: setBuddyPaused,
    completeMission: setBuddySuccess,
    failMission: setBuddySleepy,
    reset: resetBuddy,
  } = useBuddyStore();

  const config = HABIT_CONFIG[id as string] || { name: 'Mission', duration: 5 };
  const buddyType = (profile?.selected_buddy || 'dino') as 'dino' | 'bear';

  const [initialTime, setInitialTime] = useState(config.duration * 60);
  const [isMuted, setIsMuted] = useState(false);

  // Result animation values
  const boltScale = useSharedValue(0);
  const resultTextOpacity = useSharedValue(0);

  // Initialize Audio
  useEffect(() => {
    audioService.init();
    audioService.playMusic('work', { uri: AUDIO_ASSETS.music.work_time });

    return () => {
      audioService.stopMusic();
    };
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioService.setMute(newMuted);
  };

  const { timeLeft, isActive, start, stop, adjustTime } = useMissionTimer(config.duration, () => {
    setBuddySleepy();
    audioService.playSound('vo-sleepy', { uri: AUDIO_ASSETS.vo.sleepy });
    handleFinish('sleepy');
  });

  const handleFinish = React.useCallback(
    async (statusOverride?: 'success' | 'sleepy') => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);

      const finalStatus = statusOverride || 'success';

      if (finalStatus === 'success') {
        setBuddySuccess();
        audioService.playSound('success', { uri: AUDIO_ASSETS.sfx.success });
        audioService.playSound('vo-success', { uri: AUDIO_ASSETS.vo.success });

        // Trigger "Completion Pop"
        boltScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 100 }));
        resultTextOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
      } else {
        setBuddySleepy();
        resultTextOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
      }

      if (profile?.id) {
        const durationSeconds = initialTime - timeLeft;
        const boltsEarned = finalStatus === 'success' ? 1 : 0;

        try {
          const { profile: updatedProfile } = await habitLogService.logMissionResult({
            profile_id: profile.id,
            habit_id: id as string,
            status: finalStatus,
            duration_seconds: durationSeconds,
            bolts_earned: boltsEarned,
          });

          if (updatedProfile) {
            setProfile(updatedProfile);
          }
        } catch (error) {
          console.error('Error logging mission result:', error);
        }
      }

      // For now, just go back after a delay
      setTimeout(() => {
        router.back();
        resetBuddy();
      }, 4000); // 4 seconds delay as per spec
    },
    [
      isSubmitting,
      router,
      setBuddySuccess,
      resetBuddy,
      profile,
      id,
      initialTime,
      timeLeft,
      setProfile,
      setBuddySleepy,
      boltScale,
      resultTextOpacity,
    ],
  );

  const onStartPress = () => {
    audioService.playSound('tap', { uri: AUDIO_ASSETS.sfx.tap });
    audioService.playSound('vo-start', { uri: AUDIO_ASSETS.vo.start });
    start();
    setBuddyActive();
  };

  const onDonePress = () => {
    audioService.playSound('tap', { uri: AUDIO_ASSETS.sfx.tap });
    stop();
    handleFinish('success');
  };

  // VO trigger points
  useEffect(() => {
    if (!isActive) return;

    const totalTime = initialTime;
    const halfTime = Math.floor(totalTime / 2);
    const quarterTime = Math.floor(totalTime / 4);

    if (timeLeft === halfTime) {
      audioService.playSound('vo-halfway', { uri: AUDIO_ASSETS.vo.halfway });
    } else if (timeLeft === quarterTime) {
      audioService.playSound('vo-almost', { uri: AUDIO_ASSETS.vo.almost_done });
    }
  }, [timeLeft, isActive, initialTime]);

  // Handle App Lifecycle for Buddy State
  useEffect(() => {
    if (isActive) {
      setBuddyActive();
    } else if (buddyState === 'active') {
      setBuddyPaused();
    }
  }, [isActive, buddyState, setBuddyActive, setBuddyPaused]);

  // Update initial time when adjusted
  const handleAdjustTime = (seconds: number) => {
    audioService.playSound('tap', { uri: AUDIO_ASSETS.sfx.tap });
    adjustTime(seconds);
    setInitialTime((prev) => Math.max(0, prev + seconds));
  };

  const boltAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boltScale.value }],
  }));

  const textAnimationStyle = useAnimatedStyle(() => ({
    opacity: resultTextOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Confetti isActive={buddyState === 'success'} />

      {/* Result Overlay */}
      {isSubmitting && (
        <Animated.View entering={FadeIn} style={[StyleSheet.absoluteFill, styles.resultOverlay]}>
          {buddyState === 'success' ? (
            <View style={styles.resultContent}>
              <Animated.View style={[styles.boltCircle, boltAnimationStyle]}>
                <Zap size={60} color={AppColors.rewardGold} fill={AppColors.rewardGold} />
              </Animated.View>
              <Animated.View style={textAnimationStyle}>
                <Text style={styles.resultTitle}>Great Job!</Text>
                <Text style={styles.resultSubtitle}>You earned 1 Bolt!</Text>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.resultContent}>
              <Animated.View style={textAnimationStyle}>
                <Text style={[styles.resultTitle, { color: AppColors.sleepyBlue }]}>Zzz...</Text>
                <Text style={styles.resultSubtitle}>
                  Your buddy got sleepy. Let's try again next time!
                </Text>
              </Animated.View>
            </View>
          )}
        </Animated.View>
      )}

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleMute} testID="mute-toggle">
          {isMuted ? (
            <VolumeX size={24} color={AppColors.textMuted} />
          ) : (
            <Volume2 size={24} color={AppColors.textMuted} />
          )}
        </TouchableOpacity>
      </View>

      <View testID="buddy-area" style={styles.buddyArea}>
        <BuddyAnimation buddy={buddyType} state={buddyState} size={250} />
        <FloatingProp habitId={id as string} isActive={buddyState === 'active'} />
        <Text style={styles.habitTitle}>{config.name}</Text>
      </View>

      <View testID="controls-area" style={styles.controlsArea}>
        <View style={styles.timerContainer}>
          <TimerDisplay timeLeft={timeLeft} totalTime={initialTime} />
        </View>

        {!isActive && !isSubmitting ? (
          <View style={styles.setupControls}>
            <View style={styles.adjustButtons}>
              <TouchableOpacity
                testID="adjust-minus-30"
                onPress={() => handleAdjustTime(-30)}
                style={styles.adjustButton}
                disabled={timeLeft <= 30}
              >
                <Text style={styles.adjustButtonText}>-30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="adjust-plus-30"
                onPress={() => handleAdjustTime(30)}
                style={styles.adjustButton}
              >
                <Text style={styles.adjustButtonText}>+30s</Text>
              </TouchableOpacity>
            </View>
            <ScaleButton
              testID="start-mission-button"
              style={styles.startButton}
              onPress={onStartPress}
            >
              <Text style={styles.startButtonText}>Start Mission</Text>
            </ScaleButton>
          </View>
        ) : (
          <ScaleButton
            testID="done-button"
            style={[styles.doneButton, isSubmitting && styles.disabledButton]}
            onPress={onDonePress}
            disabled={isSubmitting}
            scaleTo={0.9}
          >
            <Text style={styles.doneButtonText}>Done!</Text>
          </ScaleButton>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.back();
            resetBuddy();
          }}
          disabled={isSubmitting}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.deepIndigo,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: AppColors.cardDark,
    borderRadius: 20,
  },
  buddyArea: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.deepIndigo,
  },
  controlsArea: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.cardDark,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
  },
  habitTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginTop: 20,
    fontFamily: 'FredokaOne_400Regular',
  },
  timerContainer: {
    marginBottom: 20,
  },
  setupControls: {
    alignItems: 'center',
    width: '100%',
  },
  adjustButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  adjustButton: {
    padding: 10,
    backgroundColor: AppColors.elevated,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  adjustButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    fontFamily: 'Nunito_600SemiBold',
  },
  startButton: {
    backgroundColor: AppColors.dinoGreen,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'FredokaOne_400Regular',
  },
  doneButton: {
    backgroundColor: AppColors.rewardGold,
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: AppColors.cardMedium,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'FredokaOne_400Regular',
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: AppColors.error,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold',
  },
  resultOverlay: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)', // Deep Indigo with opacity
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  resultContent: {
    alignItems: 'center',
    padding: 30,
  },
  boltCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${AppColors.rewardGold}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: AppColors.rewardGold,
  },
  resultTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: AppColors.dinoGreen,
    fontFamily: 'FredokaOne_400Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 20,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: 'Nunito_600SemiBold',
  },
});
