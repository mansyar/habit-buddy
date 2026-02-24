import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth_store';
import { Colors } from '../../src/theme/Colors';

const HABIT_NAMES: Record<string, string> = {
  brush_teeth: 'Brushing teeth',
  eat_meal: 'Eating meal',
  pick_up_toys: 'Picking up toys',
};

const BUDDY_EMOJIS: Record<string, string> = {
  dino: '🦖',
  bear: '🐻',
};

export default function MissionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile } = useAuthStore();

  const habitName = HABIT_NAMES[id as string] || 'Mission';
  const buddyEmoji = BUDDY_EMOJIS[profile?.selected_buddy || 'dino'] || '🦖';

  return (
    <View style={styles.container}>
      {/* Buddy Area (60%) */}
      <View testID="buddy-area" style={styles.buddyArea}>
        <Text style={styles.buddy}>{buddyEmoji}</Text>
        <Text style={styles.habitTitle}>{habitName}</Text>
      </View>

      {/* Controls Area (40%) */}
      <View testID="controls-area" style={styles.controlsArea}>
        <Text style={styles.placeholderText}>Timer and Controls Area</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
  placeholderText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
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
