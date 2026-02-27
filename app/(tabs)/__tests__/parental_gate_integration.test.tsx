import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HomeScreen from '../index';
import { useAuthStore } from '../../../src/store/auth_store';
import { useHabitStore } from '../../../src/store/habit_store';
import { useRouter } from 'expo-router';

// Mock stores
vi.mock('../../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../../src/store/habit_store', () => ({
  useHabitStore: vi.fn(),
}));

// Mock router
vi.mock('expo-router', () => ({
  useRouter: vi.fn(),
  Stack: {
    Screen: () => null,
  },
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

vi.mock('lucide-react-native', () => ({
  Settings: () => <div data-testid="settings-icon" />,
  Gift: () => null,
}));

describe('HomeScreen Parental Gate', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (useAuthStore as any).mockReturnValue({
      profile: { child_name: 'Buddy', id: 'p1', bolt_balance: 100 },
    });
    (useHabitStore as any).mockReturnValue({
      completedHabitIds: [],
      getCompletionPercentage: vi.fn(() => 0),
      loadTodaysHabits: vi.fn(),
      isLoading: false,
    });
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('navigates to parent dashboard after long press on settings', () => {
    const { getByTestId } = render(<HomeScreen />);

    const settingsButton = getByTestId('settings-button');

    fireEvent.contextMenu(settingsButton);

    expect(mockPush).toHaveBeenCalledWith('/parent-dashboard');
  });
});
