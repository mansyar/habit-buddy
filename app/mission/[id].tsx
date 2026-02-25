import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth_store';
import { useMissionTimer } from '../../src/components/useMissionTimer';
import { TimerDisplay } from '../../src/components/TimerDisplay';
import { Colors } from '../../src/theme/Colors';

const HABIT_CONFIG: Record<string, { name: string; duration: number }> = {
  brush_teeth: { name: 'Brushing teeth', duration: 2 },
  eat_meal: { name: 'Eating meal', duration: 15 },
  pick_up_toys: { name: 'Picking up toys', duration: 5 },
};

const BUDDY_EMOJIS: Record<string, string> = {
  dino: '🦖',
  bear: '🐻',
};

export default function MissionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = HABIT_CONFIG[id as string] || { name: 'Mission', duration: 5 };
  const buddyEmoji = BUDDY_EMOJIS[profile?.selected_buddy || 'dino'] || 'Stars';

  const [initialTime, setInitialTime] = useState(config.duration * 60);

  const handleFinish = React.useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // In the future, this will trigger Phase 4E: Mission Result & Logging
    console.log('Mission complete! Logging result...');

    // For now, just go back
    setTimeout(() => {
      router.back();
    }, 1000);
  }, [isSubmitting, router]);

  const { timeLeft, isActive, start, stop, adjustTime } = useMissionTimer(
    config.duration,
    handleFinish,
  );

  const onDonePress = () => {
    stop();
    handleFinish();
  };

  // Update initial time when adjusted
  const handleAdjustTime = (seconds: number) => {
    adjustTime(seconds);
    setInitialTime((prev) => Math.max(0, prev + seconds));
  };

  return (
    <View style={styles.container}>
      {/* Buddy Area (60%) */}
      <View testID="buddy-area" style={styles.buddyArea}>
        <Text style={styles.buddy}>{buddyEmoji}</Text>
        <Text style={styles.habitTitle}>{config.name}</Text>
      </View>

      {/* Controls Area (40%) */}
      <View testID="controls-area" style={styles.controlsArea}>
        <View style={styles.timerContainer}>
          <TimerDisplay timeLeft={timeLeft} totalTime={initialTime} />
        </View>

        {!isActive ? (
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
              onPress={start}
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
          onPress={() => router.back()}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buddy: {
    fontSize: 120,
    marginBottom: 20,
  },
  habitTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
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
});
