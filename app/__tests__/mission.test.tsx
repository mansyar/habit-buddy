import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import MissionScreen from '../mission/[id]';
import { habitLogService } from '../../src/lib/habit_log_service';
import { accessibilityHelper } from '../../src/lib/accessibility_helper';
import { hapticFeedback } from '../../src/lib/haptic_feedback';
import { audioService } from '../../src/lib/audio_service';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock react-native components for web testing
vi.mock('react-native', async (importActual) => {
  const actual: any = await importActual();
  return {
    ...actual,
    TouchableOpacity: ({ children, onPress, accessibilityLabel, testID, disabled }: any) => (
      <button
        onClick={onPress}
        aria-label={accessibilityLabel}
        data-testid={testID}
        disabled={disabled}
      >
        {children}
      </button>
    ),
    ScrollView: ({ children, accessibilityLabel }: any) => (
      <div aria-label={accessibilityLabel}>{children}</div>
    ),
    View: ({ children, accessibilityLabel, accessibilityRole, style, testID }: any) => (
      <div
        aria-label={accessibilityLabel}
        role={accessibilityRole}
        style={style}
        data-testid={testID}
      >
        {children}
      </div>
    ),
    useWindowDimensions: () => ({ width: 400, height: 800 }),
  };
});

// Mock expo-router
const mockBack = vi.fn();
const mockReplace = vi.fn();
vi.mock('expo-router', () => ({
  useLocalSearchParams: vi.fn(() => ({ id: 'tooth-brushing' })),
  useRouter: vi.fn(() => ({
    replace: mockReplace,
    back: mockBack,
  })),
}));

// Mock safe area insets
vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock AuthStore
vi.mock('../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(() => ({
    profile: { id: 'p1', selected_buddy: 'dino' },
    setProfile: vi.fn(),
  })),
}));

// Mock HabitLogService
vi.mock('../../src/lib/habit_log_service', () => ({
  habitLogService: {
    logMissionResult: vi.fn(() => Promise.resolve({ profile: { id: 'p1', bolt_balance: 51 } })),
  },
}));

// Mock AudioService
vi.mock('../../src/lib/audio_service', () => ({
  audioService: {
    init: vi.fn(),
    playSound: vi.fn(),
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    setVolume: vi.fn(),
    setMute: vi.fn(),
  },
}));

// Mock AccessibilityHelper
vi.mock('../../src/lib/accessibility_helper', () => ({
  accessibilityHelper: {
    announce: vi.fn(),
    announceBuddy: vi.fn(),
    announceMission: vi.fn(),
    announceBolts: vi.fn(),
  },
}));

// Mock HapticFeedback
vi.mock('../../src/lib/haptic_feedback', () => ({
  hapticFeedback: {
    impact: vi.fn(),
    notification: vi.fn(),
    selection: vi.fn(),
  },
}));

// Mock components
vi.mock('../../src/components/BuddyAnimation', () => ({
  BuddyAnimation: ({ state }: any) => (
    <div data-testid="buddy-animation" data-state={state}>
      Buddy
    </div>
  ),
}));

vi.mock('../../src/components/Themed', () => ({
  Text: ({ children, style, accessibilityLabel, accessibilityRole }: any) => (
    <span style={style} aria-label={accessibilityLabel} role={accessibilityRole}>
      {children}
    </span>
  ),
  View: ({ children, style }: any) => <div style={style}>{children}</div>,
}));

vi.mock('../../src/components/ScaleButton', () => ({
  ScaleButton: ({ children, onPress, accessibilityLabel, testID, disabled }: any) => (
    <button
      onClick={onPress}
      aria-label={accessibilityLabel}
      data-testid={testID}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

describe('MissionScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders correct mission info and buddy', () => {
    const { getByText, getByTestId } = render(<MissionScreen />);

    expect(getByText('Brush Your Teeth')).toBeTruthy();
    expect(getByTestId('buddy-animation')).toBeTruthy();
    expect(getByTestId('buddy-animation').getAttribute('data-state')).toBe('idle');
  });

  it('has correct accessibility labels for controls', () => {
    const { getByLabelText } = render(<MissionScreen />);

    expect(getByLabelText('Increase time by 30 seconds')).toBeTruthy();
    expect(getByLabelText('Decrease time by 30 seconds')).toBeTruthy();
    expect(getByLabelText('Start Mission')).toBeTruthy();
    expect(getByLabelText('Cancel Mission and go back')).toBeTruthy();
  });

  it('transitions state when mission starts', () => {
    const { getByLabelText, getByTestId } = render(<MissionScreen />);

    const startButton = getByLabelText('Start Mission');
    act(() => {
      fireEvent.click(startButton);
    });

    expect(getByTestId('buddy-animation').getAttribute('data-state')).toBe('active');
    expect(getByLabelText('Finish Mission')).toBeTruthy();
  });

  it('formats timer display correctly', () => {
    const { getByText, getByLabelText } = render(<MissionScreen />);

    // Default 2:00
    expect(getByText('2:00')).toBeTruthy();

    const plusButton = getByLabelText('Increase time by 30 seconds');
    act(() => {
      fireEvent.click(plusButton);
    });
    expect(getByText('2:30')).toBeTruthy();
  });

  it('handles mission completion flow', async () => {
    vi.useRealTimers();
    const { getByLabelText, getByTestId } = render(<MissionScreen />);

    // Start
    act(() => {
      fireEvent.click(getByLabelText('Start Mission'));
    });

    // Finish
    const finishButton = getByLabelText('Finish Mission');
    act(() => {
      fireEvent.click(finishButton);
    });

    expect(getByTestId('buddy-animation').getAttribute('data-state')).toBe('success');
    expect(habitLogService.logMissionResult).toHaveBeenCalled();

    await waitFor(
      () => {
        expect(mockBack).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });
});
