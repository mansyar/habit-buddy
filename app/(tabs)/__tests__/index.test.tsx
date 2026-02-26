import React from 'react';
import { render } from '@testing-library/react';
import HomeScreen from '../index';
import { useAuthStore } from '../../../src/store/auth_store';
import { useHabitStore } from '../../../src/store/habit_store';

// Mock stores
vi.mock('../../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../../src/store/habit_store', () => ({
  useHabitStore: vi.fn(),
}));

// Mock components
vi.mock('../../../src/components/BoltCounter', () => ({
  BoltCounter: ({ balance }: any) => <div data-testid="bolt-counter">{balance}</div>,
}));

vi.mock('../../../src/components/CautionTapeProgress', () => ({
  CautionTapeProgress: ({ progress }: any) => <div data-testid="progress-bar">{progress}</div>,
}));

vi.mock('../../../src/components/HabitCard', () => ({
  HabitCard: ({ habit }: any) => <div data-testid={`habit-card-${habit.id}`}>{habit.name}</div>,
}));

vi.mock('../../../src/components/useColorScheme', () => ({
  useColorScheme: vi.fn(() => 'light'),
}));

vi.mock('../../../src/components/useClientOnlyValue', () => ({
  useClientOnlyValue: vi.fn((a, b) => b),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthStore as any).mockReturnValue({
      profile: { child_name: 'Buddy', id: 'p1', bolt_balance: 100 },
    });
    (useHabitStore as any).mockReturnValue({
      completedHabitIds: ['tooth-brushing'],
      getCompletionPercentage: vi.fn(() => 33),
      loadTodaysHabits: vi.fn(),
      isLoading: false,
    });
  });

  it('renders correctly with profile name and bolt balance', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    expect(getByText('Hi, Buddy!')).toBeTruthy();
    expect(getByTestId('bolt-counter')).toBeTruthy();
    expect(getByTestId('progress-bar')).toBeTruthy();
    expect(getByTestId('habit-card-tooth-brushing')).toBeTruthy();
    expect(getByTestId('habit-card-meal-time')).toBeTruthy();
    expect(getByTestId('habit-card-toy-cleanup')).toBeTruthy();
  });
});
