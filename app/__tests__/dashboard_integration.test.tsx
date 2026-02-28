import React from 'react';
import { render } from '@testing-library/react';
import ParentDashboardScreen from '../parent-dashboard';
import { useAuthStore } from '../../src/store/auth_store';
import { vi, expect, test, describe, beforeEach } from 'vitest';

// Mock SQLite
const mockDb = {
  execAsync: vi.fn(async () => {}),
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => null),
  getAllAsync: vi.fn(async () => []),
};

vi.mock('../../src/lib/sqlite', () => ({
  initializeSQLite: vi.fn(() => Promise.resolve(mockDb)),
}));

vi.mock('../../src/lib/network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(false)), // Offline to avoid Supabase calls
  networkService: {
    isOnline: vi.fn(() => Promise.resolve(false)),
    subscribeToConnectionChange: vi.fn(() => vi.fn()),
  },
}));

vi.mock('../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      profile: { id: 'p1' },
    });
  });

  test('fetches and displays real data from SQLite via DashboardService', async () => {
    // Use implementation to handle parallel calls
    mockDb.getFirstAsync.mockImplementation(async (query: string) => {
      if (query.includes('FROM profiles')) return { id: 'p1', bolt_balance: 120 };
      if (query.includes('SUM(bolts_earned)')) return { total_earned: 200 };
      if (query.includes('SUM(bolt_cost)')) return { total_spent: 80 };
      if (query.includes('AVG(daily_count)')) return { avg_habits: 2.8 };
      return null;
    });

    mockDb.getAllAsync.mockImplementation(async (query: string) => {
      if (query.includes('GROUP BY date(completed_at)')) {
        return [{ date: '2026-02-26', count: 3 }];
      }
      if (query.includes('habit_id')) {
        return [{ habit_id: 'tooth-brushing' }];
      }
      return [];
    });

    const { findByText } = render(<ParentDashboardScreen />);

    expect(await findByText('200')).toBeTruthy();
    expect(await findByText('80')).toBeTruthy();
    expect(await findByText('120')).toBeTruthy();
    expect(await findByText('2.8')).toBeTruthy();
    expect(await findByText('✅ Completed')).toBeTruthy();
  });
});
