import { create } from 'zustand';
import { habitLogService } from '../lib/habit_log_service';
import { CORE_HABITS } from '../constants/habits';

interface HabitState {
  completedHabitIds: string[];
  isLoading: boolean;
  loadTodaysHabits: (profileId: string) => Promise<void>;
  getCompletionPercentage: () => number;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  completedHabitIds: [],
  isLoading: false,

  loadTodaysHabits: async (profileId: string) => {
    set({ isLoading: true });
    try {
      const logs = await habitLogService.getTodaysLogs(profileId);
      const completedIds = logs
        .filter((log) => log.status === 'success')
        .map((log) => log.habit_id);

      // We only care about the 3 core habits for the home screen progress
      const coreCompletedIds = CORE_HABITS.filter((habit) => completedIds.includes(habit.id)).map(
        (habit) => habit.id,
      );

      set({ completedHabitIds: coreCompletedIds });
    } catch (error) {
      console.error("Failed to load today's habits:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getCompletionPercentage: () => {
    const { completedHabitIds } = get();
    if (CORE_HABITS.length === 0) return 0;
    const percentage = (completedHabitIds.length / CORE_HABITS.length) * 100;
    return Math.round(percentage);
  },
}));
