import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Parent Dashboard',
          headerStyle: { backgroundColor: '#1A1A2E' },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: { fontFamily: 'Fredoka-One', color: '#F8FAFC' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color="#F8FAFC" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerButton}>
              <SettingsIcon size={24} color="#F8FAFC" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bolt Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.sectionTitle}>Bolt Statistics</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.bolt_stats.total_earned || 0}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.bolt_stats.total_spent || 0}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.bolt_stats.current_balance || 0}</Text>
              <Text style={styles.statLabel}>Current Balance</Text>
            </View>
            <View style={styles.statCard}>
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
            <ClipboardList size={20} color="#4ECDC4" />
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
            <Calendar size={20} color="#FF6B6B" />
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
          <TouchableOpacity style={styles.resetButton} onPress={handleResetToday}>
            <RefreshCw size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.resetButtonText}>Reset Today's Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manageRewardsButton}
            onPress={() => router.push('/reward-shop')}
          >
            <Text style={styles.manageRewardsText}>Manage Rewards</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E', // deepIndigo
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
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
    backgroundColor: '#2A2A4A', // cardDark
    borderRadius: 20, // xl radius
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    color: '#F8FAFC', // textPrimary
    fontFamily: 'Nunito-Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#16213E', // nightPurple
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FBBF24', // rewardGold
    fontFamily: 'Fredoka-One',
  },
  statLabel: {
    fontSize: 12,
    color: '#CBD5E1', // textSecondary
    marginTop: 4,
    fontFamily: 'Nunito-Regular',
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
    borderBottomColor: '#3A3A5C', // cardMedium
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F8FAFC',
    fontFamily: 'Nunito-SemiBold',
  },
  statusDone: {
    color: '#4ADE80', // dinoGreen
    fontWeight: '600',
    fontSize: 14,
  },
  statusTodo: {
    color: '#64748B', // textMuted
    fontSize: 14,
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
    width: 36, // Match design guide
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  streakCircleDone: {
    backgroundColor: '#4ADE80',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  streakCirclePartial: {
    backgroundColor: '#3A3A5C',
    borderWidth: 1,
    borderColor: '#4A4A6A',
  },
  streakCount: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Nunito-Bold',
  },
  dayLabel: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'Nunito-Regular',
  },
  actionsContainer: {
    marginTop: 10,
    gap: 12,
  },
  resetButton: {
    backgroundColor: '#EF4444', // error
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
    fontFamily: 'Fredoka-One',
  },
  manageRewardsButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FBBF24', // rewardGold
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  manageRewardsText: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Fredoka-One',
  },
});
