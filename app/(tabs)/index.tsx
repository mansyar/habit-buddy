import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, useWindowDimensions } from 'react-native';
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
import { AppColors } from '@/theme/Colors';
import { ScaleButton } from '@/components/ScaleButton';

export default function HomeScreen() {
  const { profile } = useAuthStore();
  const { completedHabitIds, getCompletionPercentage, loadTodaysHabits } = useHabitStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (profile?.id) {
      loadTodaysHabits(profile.id);
    }
  }, [profile?.id, loadTodaysHabits]);

  const progress = getCompletionPercentage();

  // Tablet scaling logic
  const isTablet = width >= 600;
  const isLargeTablet = width > 900;
  const contentWidth = isLargeTablet ? 600 : '100%';
  const numColumns = isTablet ? 2 : 1;

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
          <ScaleButton
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
            onLongPress={() => router.push('/parent-dashboard')}
            delayLongPress={3000}
            testID="settings-button"
          >
            <Settings size={22} color={AppColors.textMuted} />
          </ScaleButton>
          <ScaleButton style={styles.iconButton} onPress={() => router.push('/reward-shop')}>
            <Gift size={22} color={AppColors.error} />
          </ScaleButton>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isLargeTablet && { alignSelf: 'center', width: 600 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Daily Missions</Text>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <CautionTapeProgress progress={progress} />
        </View>

        <View style={[styles.habitsGrid, isTablet && styles.habitsGridTablet]}>
          {CORE_HABITS.map((habit) => (
            <View key={habit.id} style={isTablet ? styles.habitWrapperTablet : styles.habitWrapper}>
              <HabitCard habit={habit} isCompleted={completedHabitIds.includes(habit.id)} />
            </View>
          ))}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.deepIndigo,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: AppColors.deepIndigo,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.cardDark,
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
    fontFamily: 'FredokaOne_400Regular',
    color: AppColors.textPrimary,
  },
  iconButton: {
    marginLeft: 12,
    padding: 10,
    borderRadius: 15,
    backgroundColor: AppColors.cardDark,
    borderWidth: 1,
    borderColor: AppColors.elevated,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
  },
  progressContainer: {
    marginBottom: 20,
  },
  habitsGrid: {
    width: '100%',
  },
  habitsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  habitWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  habitWrapperTablet: {
    width: '48%',
    marginBottom: 16,
  },
  footerSpacer: {
    height: 40,
  },
});
