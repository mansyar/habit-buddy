import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HomeScreen from '../index';
import { useAuthStore } from '../../../src/store/auth_store';
import { useHabitStore } from '../../../src/store/habit_store';
import { routerMock } from '../../../vitest.setup';

// Mock stores
vi.mock('../../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../../src/store/habit_store', () => ({
  useHabitStore: vi.fn(),
}));

// Mock components
vi.mock('../../../src/components/BoltCounter', () => ({
  BoltCounter: () => null,
}));

vi.mock('../../../src/components/CautionTapeProgress', () => ({
  CautionTapeProgress: () => null,
}));

vi.mock('../../../src/components/HabitCard', () => ({
  HabitCard: () => null,
}));

describe('HomeScreen Parental Gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthStore as any).mockReturnValue({
      profile: { child_name: 'Buddy', id: 'p1', bolt_balance: 100 },
    });
    (useHabitStore as any).mockReturnValue({
      completedHabitIds: [],
      getCompletionPercentage: vi.fn(() => 0),
      loadTodaysHabits: vi.fn(),
      isLoading: false,
    });
  });

  it('navigates to parent dashboard after long press on settings', () => {
    const { getByTestId } = render(<HomeScreen />);

    const settingsButton = getByTestId('settings-button');

    fireEvent.contextMenu(settingsButton);

    expect(routerMock.push).toHaveBeenCalledWith('/parent-dashboard');
  });
});
