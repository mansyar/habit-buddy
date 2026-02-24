import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { useAuthStore } from '@/store/auth_store';
import { useHabitStore } from '@/store/habit_store';
import { CORE_HABITS } from '@/constants/habits';
import { HabitCard } from '@/components/HabitCard';
import { BoltCounter } from '@/components/BoltCounter';
import { CautionTapeProgress } from '@/components/CautionTapeProgress';
import { Settings, Gift } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { profile } = useAuthStore();
  const { completedHabitIds, getCompletionPercentage, loadTodaysHabits, isLoading } =
    useHabitStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (profile?.id) {
      loadTodaysHabits(profile.id);
    }
  }, [profile?.id]);

  const progress = getCompletionPercentage();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom App Bar */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hi, {profile?.child_name || 'Buddy'}!</Text>
        </View>
        <View style={styles.headerRight}>
          <BoltCounter balance={profile?.bolt_balance || 0} />
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
            <Settings size={24} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/reward-shop')}>
            <Gift size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Indicator */}
      <CautionTapeProgress progress={progress} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Daily Missions</Text>

        {CORE_HABITS.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            isCompleted={completedHabitIds.includes(habit.id)}
          />
        ))}

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFCFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Fredoka-One',
    color: '#333',
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#444',
  },
  footerSpacer: {
    height: 40,
  },
});
