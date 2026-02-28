import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  RefreshCw,
  Settings as SettingsIcon,
  Zap,
  Calendar,
  ClipboardList,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth_store';
import { dashboardService } from '@/lib/dashboard_service';
import { DashboardStats } from '@/types/dashboard';
import { habitLogService } from '@/lib/habit_log_service';
import { AppColors } from '@/theme/Colors';
import { ScaleButton } from '@/components/ScaleButton';
import { NetworkStatusIcon } from '@/components/NetworkStatusIcon';

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const loadStats = React.useCallback(async () => {
    if (profile?.id) {
      setLoading(true);
      const data = await dashboardService.getDashboardStats(profile.id);
      setStats(data);
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    loadStats();
  }, [profile?.id, loadStats]);

  const handleResetToday = async () => {
    Alert.alert(
      "Reset Today's Progress",
      'Are you sure you want to clear all habit logs for today? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            if (profile?.id) {
              await habitLogService.resetTodayProgress(profile.id);
              await loadStats();
            }
          },
        },
      ],
    );
  };

  if (loading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.dinoGreen} />
      </View>
    );
  }

  // Tablet scaling logic
  const isTablet = width >= 600;
  const isLargeTablet = width > 900;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerStyle: { backgroundColor: AppColors.deepIndigo },
          headerTintColor: AppColors.textPrimary,
          headerTitleStyle: { fontFamily: 'FredokaOne_400Regular', color: AppColors.textPrimary },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={AppColors.textPrimary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <NetworkStatusIcon size={18} style={{ marginRight: 15 }} />
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.headerButton}
              >
                <SettingsIcon size={24} color={AppColors.textPrimary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isLargeTablet && { alignSelf: 'center', width: 600 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Bolt Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color={AppColors.rewardGold} fill={AppColors.rewardGold} />
            <Text style={styles.sectionTitle}>Bolt Statistics</Text>
          </View>
          <View style={[styles.statsGrid, isTablet && styles.statsGridTablet]}>
            <View style={[styles.statCard, isTablet && styles.statCardTablet]}>
              <Text style={styles.statValue}>{stats?.bolt_stats.total_earned || 0}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={[styles.statCard, isTablet && styles.statCardTablet]}>
              <Text style={styles.statValue}>{stats?.bolt_stats.total_spent || 0}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={[styles.statCard, isTablet && styles.statCardTablet]}>
              <Text style={styles.statValue}>{stats?.bolt_stats.current_balance || 0}</Text>
              <Text style={styles.statLabel}>Current Balance</Text>
            </View>
            <View style={[styles.statCard, isTablet && styles.statCardTablet]}>
              <Text style={styles.statValue}>
                {stats?.daily_average_habits.toFixed(1) || '0.0'}
              </Text>
              <Text style={styles.statLabel}>Daily Avg Habits</Text>
            </View>
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ClipboardList size={20} color={AppColors.dinoGreen} />
            <Text style={styles.sectionTitle}>Today's Summary</Text>
          </View>
          <View style={styles.summaryList}>
            {stats?.today_summary.map((habit) => (
              <View key={habit.habit_id} style={styles.summaryItem}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={habit.is_completed ? styles.statusDone : styles.statusTodo}>
                  {habit.is_completed ? '✅ Completed' : '❌ Incomplete'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 7-Day Streak */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={AppColors.error} />
            <Text style={styles.sectionTitle}>7-Day Streak</Text>
          </View>
          <View style={styles.streakContainer}>
            {stats?.weekly_streak.map((day) => (
              <View key={day.date} style={styles.streakDay}>
                <View
                  style={[
                    styles.streakCircle,
                    day.is_fully_completed ? styles.streakCircleDone : styles.streakCirclePartial,
                  ]}
                >
                  <Text style={styles.streakCount}>
                    {day.completed_count}/{day.total_count}
                  </Text>
                </View>
                <Text style={styles.dayLabel}>{day.date.split('-').slice(1).join('/')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Administrative Actions */}
        <View style={styles.actionsContainer}>
          <ScaleButton style={styles.resetButton} onPress={handleResetToday}>
            <RefreshCw size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.resetButtonText}>Reset Today's Progress</Text>
          </ScaleButton>

          <ScaleButton
            style={styles.manageRewardsButton}
            onPress={() => router.push('/reward-shop')}
          >
            <Text style={styles.manageRewardsText}>Manage Rewards</Text>
          </ScaleButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.deepIndigo,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.deepIndigo,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsGridTablet: {
    justifyContent: 'flex-start',
    gap: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: AppColors.nightPurple,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.elevated,
  },
  statCardTablet: {
    width: '23%',
    marginBottom: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.rewardGold,
    fontFamily: 'FredokaOne_400Regular',
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
  },
  summaryList: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.cardMedium,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.textPrimary,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusDone: {
    color: AppColors.dinoGreen,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  statusTodo: {
    color: AppColors.textMuted,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  streakDay: {
    alignItems: 'center',
  },
  streakCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  streakCircleDone: {
    backgroundColor: AppColors.dinoGreen,
  },
  streakCirclePartial: {
    backgroundColor: AppColors.cardMedium,
    borderWidth: 1,
    borderColor: AppColors.elevated,
  },
  streakCount: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  dayLabel: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontFamily: 'Nunito_400Regular',
  },
  actionsContainer: {
    marginTop: 10,
    gap: 12,
  },
  resetButton: {
    backgroundColor: AppColors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'FredokaOne_400Regular',
  },
  manageRewardsButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AppColors.rewardGold,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  manageRewardsText: {
    color: AppColors.rewardGold,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'FredokaOne_400Regular',
  },
});
