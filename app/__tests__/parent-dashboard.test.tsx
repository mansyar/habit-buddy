import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ParentDashboardScreen from '../parent-dashboard';
import { useAuthStore } from '../../src/store/auth_store';
import { dashboardService } from '../../src/lib/dashboard_service';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Mock stores
vi.mock('../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

// Mock services
vi.mock('../../src/lib/dashboard_service', () => ({
  dashboardService: {
    getDashboardStats: vi.fn(),
  },
}));

// Mock router and components handled by vitest.setup.ts
// But we need to ensure useRouter returns the mock we expect
const mockPush = vi.fn();
(useRouter as any).mockReturnValue({
  push: mockPush,
  back: vi.fn(),
});

describe('ParentDashboardScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthStore as any).mockReturnValue({
      profile: { id: 'p1' },
    });

    (dashboardService.getDashboardStats as any).mockResolvedValue({
      bolt_stats: { total_earned: 150, total_spent: 50, current_balance: 100 },
      daily_average_habits: 2.5,
      weekly_streak: [
        { date: '2026-02-26', is_fully_completed: true, completed_count: 3, total_count: 3 },
      ],
      today_summary: [
        { habit_id: 'h1', name: 'Habit 1', is_completed: true },
        { habit_id: 'h2', name: 'Habit 2', is_completed: false },
        { habit_id: 'h3', name: 'Habit 3', is_completed: true },
      ],
    });
  });

  it('renders summary, streak, and stats sections', async () => {
    const { findByText } = render(<ParentDashboardScreen />);

    expect(await findByText("Today's Summary")).toBeTruthy();
    expect(await findByText('7-Day Streak')).toBeTruthy();
    expect(await findByText('Bolt Statistics')).toBeTruthy();

    // Check for some data
    expect(await findByText('150')).toBeTruthy(); // Total earned
    expect(await findByText('Habit 1')).toBeTruthy();
  });

  it('shows alert when reset button is pressed', async () => {
    const spy = vi.spyOn(Alert, 'alert');
    const { findByText } = render(<ParentDashboardScreen />);

    const resetButton = await findByText("Reset Today's Progress");
    fireEvent.click(resetButton);

    expect(spy).toHaveBeenCalled();
  });

  it('navigates to reward shop when manage rewards button is pressed', async () => {
    const { findByText } = render(<ParentDashboardScreen />);

    const manageButton = await findByText('Manage Rewards');
    fireEvent.click(manageButton);

    expect(mockPush).toHaveBeenCalledWith('/reward-shop');
  });
});
