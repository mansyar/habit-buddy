import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHabitStore } from '../habit_store';
import { habitLogService } from '../../lib/habit_log_service';

vi.mock('../../lib/habit_log_service', () => ({
  habitLogService: {
    getTodaysLogs: vi.fn(),
  },
}));

describe('HabitStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state manually if needed, or by calling a reset action if implemented
    // Assuming we have a reset or can just set initial values
  });

  it('should have initial state with no habits completed', () => {
    const state = useHabitStore.getState();
    expect(state.completedHabitIds).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it("should load today's habits and update completion status", async () => {
    const mockLogs = [
      { habit_id: 'tooth-brushing', status: 'success' },
      { habit_id: 'meal-time', status: 'success' },
    ] as any;

    (habitLogService.getTodaysLogs as any).mockResolvedValue(mockLogs);

    await useHabitStore.getState().loadTodaysHabits('profile-123');

    expect(habitLogService.getTodaysLogs).toHaveBeenCalledWith('profile-123');
    expect(useHabitStore.getState().completedHabitIds).toContain('tooth-brushing');
    expect(useHabitStore.getState().completedHabitIds).toContain('meal-time');
    expect(useHabitStore.getState().completedHabitIds).not.toContain('toy-cleanup');
  });

  it('should calculate completion percentage correctly', async () => {
    const store = useHabitStore.getState();

    // 0 habits
    (habitLogService.getTodaysLogs as any).mockResolvedValue([]);
    await store.loadTodaysHabits('profile-123');
    expect(store.getCompletionPercentage()).toBe(0);

    // 1 habit
    (habitLogService.getTodaysLogs as any).mockResolvedValue([
      { habit_id: 'tooth-brushing', status: 'success' },
    ]);
    await store.loadTodaysHabits('profile-123');
    expect(store.getCompletionPercentage()).toBe(Math.round((1 / 3) * 100));

    // 2 habits
    (habitLogService.getTodaysLogs as any).mockResolvedValue([
      { habit_id: 'tooth-brushing', status: 'success' },
      { habit_id: 'meal-time', status: 'success' },
    ]);
    await store.loadTodaysHabits('profile-123');
    expect(store.getCompletionPercentage()).toBe(Math.round((2 / 3) * 100));

    // 3 habits
    (habitLogService.getTodaysLogs as any).mockResolvedValue([
      { habit_id: 'tooth-brushing', status: 'success' },
      { habit_id: 'meal-time', status: 'success' },
      { habit_id: 'toy-cleanup', status: 'success' },
    ]);
    await store.loadTodaysHabits('profile-123');
    expect(store.getCompletionPercentage()).toBe(100);
  });
});
