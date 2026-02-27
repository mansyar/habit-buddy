import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth_store';
import { useBuddyStore } from '../../src/store/buddy_store';
import { useMissionTimer } from '../../src/components/useMissionTimer';
import { TimerDisplay } from '../../src/components/TimerDisplay';
import { BuddyAnimation } from '../../src/components/BuddyAnimation';
import { FloatingProp } from '../../src/components/FloatingProp';
import { Confetti } from '../../src/components/Confetti';
import { Colors } from '../../src/theme/Colors';
import { audioService } from '../../src/lib/audio_service';
import { AUDIO_ASSETS } from '../../src/constants/audio';
import { Volume2, VolumeX, Bolt } from 'lucide-react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { habitLogService } from '../../src/lib/habit_log_service';

const HABIT_CONFIG: Record<string, { name: string; duration: number }> = {
  'tooth-brushing': { name: 'Brushing teeth', duration: 2 },
  'meal-time': { name: 'Eating meal', duration: 15 },
  'toy-cleanup': { name: 'Picking up toys', duration: 5 },
};

export default function MissionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile, setProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (isSubmitting) return;
      setIsSubmitting(true);

      const finalStatus = statusOverride || 'success';

      if (finalStatus === 'success') {
        setBuddySuccess();
        audioService.playSound('success', { uri: AUDIO_ASSETS.sfx.success });
        audioService.playSound('vo-success', { uri: AUDIO_ASSETS.vo.success });
      } else {
        setBuddySleepy();
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

  return (
    <View style={styles.container}>
      <Confetti isActive={buddyState === 'success'} />
      {/* Result Overlay */}
      {isSubmitting && (
        <Animated.View entering={FadeIn} style={[StyleSheet.absoluteFill, styles.resultOverlay]}>
          {buddyState === 'success' ? (
            <Animated.View entering={ZoomIn} style={styles.resultContent}>
              <View style={styles.boltCircle}>
                <Bolt size={60} color="#FFD700" fill="#FFD700" />
              </View>
              <Text style={styles.resultTitle}>Great Job!</Text>
              <Text style={styles.resultSubtitle}>You earned 1 Bolt!</Text>
            </Animated.View>
          ) : (
            <Animated.View entering={ZoomIn} style={styles.resultContent}>
              <Text style={[styles.resultTitle, { color: '#607D8B' }]}>Zzz...</Text>
              <Text style={styles.resultSubtitle}>
                Your buddy got sleepy. Let's try again next time!
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      )}
      {/* Top Header for controls like Mute */}{' '}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleMute} testID="mute-toggle">
          {isMuted ? <VolumeX size={24} color="#555" /> : <Volume2 size={24} color="#555" />}
        </TouchableOpacity>
      </View>
      {/* Buddy Area (60%) */}
      <View testID="buddy-area" style={styles.buddyArea}>
        <BuddyAnimation buddy={buddyType} state={buddyState} size={250} />
        <FloatingProp habitId={id as string} isActive={buddyState === 'active'} />
        <Text style={styles.habitTitle}>{config.name}</Text>
      </View>
      {/* Controls Area (40%) */}
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
            <TouchableOpacity
              testID="start-mission-button"
              style={styles.startButton}
              onPress={onStartPress}
            >
              <Text style={styles.startButtonText}>Start Mission</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            testID="done-button"
            style={[styles.doneButton, isSubmitting && styles.disabledButton]}
            onPress={onDonePress}
            disabled={isSubmitting}
          >
            <Text style={styles.doneButtonText}>Done!</Text>
          </TouchableOpacity>
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
    backgroundColor: Colors.light.background,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  buddyArea: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
  },
  controlsArea: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  habitTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  adjustButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FF5252',
    fontWeight: 'bold',
  },
  resultOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 10px rgba(255, 215, 0, 0.3)',
    elevation: 8,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: 'Fredoka-One',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
