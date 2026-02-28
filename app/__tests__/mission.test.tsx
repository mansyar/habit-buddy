import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import MissionScreen from '../mission/[id]';
import { habitLogService } from '../../src/lib/habit_log_service';
import { accessibilityHelper } from '../../src/lib/accessibility_helper';
import { hapticFeedback } from '../../src/lib/haptic_feedback';

// Mock expo-router
const mockBack = vi.fn();
vi.mock('expo-router', () => ({
  useLocalSearchParams: vi.fn(() => ({ id: 'tooth-brushing' })),
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
    back: mockBack,
  })),
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

describe('MissionScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test('renders buddy area and controls area with correct layout', () => {
    const { getByTestId } = render(<MissionScreen />);

    expect(getByTestId('buddy-area')).toBeTruthy();
    expect(getByTestId('controls-area')).toBeTruthy();
  });

  test('displays the correct buddy animation based on profile', () => {
    const { getByTestId } = render(<MissionScreen />);
    expect(getByTestId('buddy-animation')).toBeTruthy();
  });

  test('displays mission name based on id param', () => {
    const { getByText } = render(<MissionScreen />);
    expect(getByText('Brush Your Teeth')).toBeTruthy();
  });

  test('starts mission when Start button is pressed', () => {
    const { getByText, queryByText, getByTestId } = render(<MissionScreen />);

    const startButton = getByText('Start Mission');
    act(() => {
      fireEvent.click(startButton);
    });

    expect(queryByText('Start Mission')).toBeNull();
    expect(getByTestId('done-button')).toBeTruthy();
  });

  test('adjusts time using buttons', () => {
    const { getByText } = render(<MissionScreen />);

    // Default for brush_teeth is 2:00
    expect(getByText('2:00')).toBeTruthy();

    const plus30 = getByText('+30s');
    act(() => {
      fireEvent.click(plus30);
    });
    expect(getByText('2:30')).toBeTruthy();

    const minus30 = getByText('-30s');
    act(() => {
      fireEvent.click(minus30);
    });
    expect(getByText('2:00')).toBeTruthy();
  });

  test('Done! button triggers submission and navigation', async () => {
    vi.useRealTimers();
    const { getByText, getByTestId } = render(<MissionScreen />);

    // Start mission
    act(() => {
      fireEvent.click(getByText('Start Mission'));
    });

    // Press Done!
    const doneButton = getByTestId('done-button');
    act(() => {
      fireEvent.click(doneButton);
    });

    // Should be disabled
    expect(doneButton).toHaveProperty('disabled', true);

    // Wait for the timeout and navigation (4s delay)
    await waitFor(
      () => {
        expect(mockBack).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  test('Done! button prevents double-submission', async () => {
    const { getByText, getByTestId } = render(<MissionScreen />);

    // Start mission
    act(() => {
      fireEvent.click(getByText('Start Mission'));
    });

    const doneButton = getByTestId('done-button');

    // Simulate rapid double-tap
    act(() => {
      fireEvent.click(doneButton);
      fireEvent.click(doneButton);
    });

    // Should only call service once
    expect(habitLogService.logMissionResult).toHaveBeenCalledTimes(1);
  });

  test('announces mission start and completion', async () => {
    vi.useRealTimers();
    const { getByText, getByTestId } = render(<MissionScreen />);

    // Start mission
    act(() => {
      fireEvent.click(getByText('Start Mission'));
    });
    expect(accessibilityHelper.announceMission).toHaveBeenCalledWith('Started');

    // Press Done!
    act(() => {
      fireEvent.click(getByTestId('done-button'));
    });
    expect(accessibilityHelper.announceMission).toHaveBeenCalledWith('Completed');

    await waitFor(() => {
      expect(accessibilityHelper.announceBolts).toHaveBeenCalledWith(expect.any(Number), 1);
    });

    expect(hapticFeedback.notification).toHaveBeenCalledWith('success');
  });
});
