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

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: vi.fn(),
  Stack: {
    Screen: () => null,
  },
}));

// Mock safe area insets
vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-native components for web testing
vi.mock('react-native', async (importActual) => {
  const actual: any = await importActual();
  return {
    ...actual,
    TouchableOpacity: ({ children, onPress, accessibilityLabel, testID }: any) => (
      <button onClick={onPress} aria-label={accessibilityLabel} data-testid={testID}>
        {children}
      </button>
    ),
    ScrollView: ({ children, accessibilityLabel }: any) => (
      <div aria-label={accessibilityLabel}>{children}</div>
    ),
    View: ({ children, accessibilityLabel, accessibilityRole, style }: any) => (
      <div aria-label={accessibilityLabel} role={accessibilityRole} style={style}>
        {children}
      </div>
    ),
    useWindowDimensions: () => ({ width: 400, height: 800 }),
  };
});

// Mock components
vi.mock('../../../src/components/BoltCounter', () => ({
  BoltCounter: ({ balance }: any) => <div data-testid="bolt-counter">{balance}</div>,
}));

vi.mock('../../../src/components/CautionTapeProgress', () => ({
  CautionTapeProgress: ({ progress }: any) => <div data-testid="progress-bar">{progress}%</div>,
}));

vi.mock('../../../src/components/HabitCard', () => ({
  HabitCard: ({ habit, isCompleted }: any) => (
    <div data-testid={`habit-card-${habit.id}`} data-completed={isCompleted}>
      {habit.name}
    </div>
  ),
}));

vi.mock('../../../src/components/ScaleButton', () => ({
  ScaleButton: ({ children, onPress, accessibilityLabel }: any) => (
    <button onClick={onPress} aria-label={accessibilityLabel} data-testid="scale-button">
      {children}
    </button>
  ),
}));

vi.mock('../../../src/components/NetworkStatusIcon', () => ({
  NetworkStatusIcon: () => null,
}));

vi.mock('../../../src/components/Themed', () => ({
  Text: ({ children, style }: any) => <span style={style}>{children}</span>,
  View: ({ children, style }: any) => <div style={style}>{children}</div>,
}));

describe('HomeScreen', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthStore as any).mockReturnValue({
      profile: { child_name: 'Buddy', id: 'p1', bolt_balance: 100 },
    });
    (useHabitStore as any).mockReturnValue({
      completedHabitIds: ['tooth-brushing'],
      getCompletionPercentage: vi.fn(() => 33),
      loadTodaysHabits: vi.fn(),
    });
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders correctly with profile name and bolt balance', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    expect(getByText('Hi, Buddy!')).toBeTruthy();
    expect(getByTestId('bolt-counter')).toBeTruthy();
  });

  it('has correct accessibility labels', () => {
    const { getByLabelText } = render(<HomeScreen />);

    expect(getByLabelText('Settings. Long press for parent dashboard.')).toBeTruthy();
    expect(getByLabelText('Reward Shop')).toBeTruthy();
    expect(getByLabelText('33% of daily missions completed')).toBeTruthy();
  });

  it('navigates to settings on press', () => {
    const { getByTestId } = render(<HomeScreen />);
    const settingsButton = getByTestId('settings-button');

    fireEvent.click(settingsButton);
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('navigates to reward shop on press', () => {
    const { getByLabelText } = render(<HomeScreen />);
    const rewardShopButton = getByLabelText('Reward Shop');

    fireEvent.click(rewardShopButton);
    expect(mockPush).toHaveBeenCalledWith('/reward-shop');
  });
});
