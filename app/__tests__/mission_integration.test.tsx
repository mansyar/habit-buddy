import { expect, test, vi, describe, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import HomeScreen from '../(tabs)/index';
import MissionScreen from '../mission/[id]';
import { useAuthStore } from '../../src/store/auth_store';
import { useHabitStore } from '../../src/store/habit_store';
import { useBuddyStore } from '../../src/store/buddy_store';
import { habitLogService } from '../../src/lib/habit_log_service';

// Mock essential services but keep store logic
vi.mock('../../src/lib/habit_log_service', () => ({
  habitLogService: {
    logMissionResult: vi.fn(async (data) => {
      // Simulate store update that would happen in real app
      const profile = useAuthStore.getState().profile;
      if (profile) {
        const newBalance =
          profile.bolt_balance + (data.status === 'success' ? data.bolts_earned : 0);
        useAuthStore.getState().setProfile({ ...profile, bolt_balance: newBalance });
      }
      return { profile: useAuthStore.getState().profile };
    }),
    getTodaysLogs: vi.fn(async () => []),
  },
}));

// Mock Audio, Haptics, etc.
vi.mock('../../src/lib/audio_service', () => ({
  audioService: { init: vi.fn(), playSound: vi.fn(), playMusic: vi.fn(), stopMusic: vi.fn() },
}));
vi.mock('../../src/lib/haptic_feedback', () => ({
  hapticFeedback: { notification: vi.fn(), impact: vi.fn() },
}));
vi.mock('../../src/lib/accessibility_helper', () => ({
  accessibilityHelper: {
    announce: vi.fn(),
    announceMission: vi.fn(),
    announceBolts: vi.fn(),
    announceBuddy: vi.fn(),
  },
}));
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  selectionAsync: vi.fn(),
  ImpactFeedbackStyle: { Medium: 1 },
  NotificationFeedbackType: { Success: 0 },
}));

describe('Full Mission Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Initial state
    useAuthStore.setState({
      profile: { id: 'p1', child_name: 'Buddy', bolt_balance: 10, selected_buddy: 'dino' },
    });
    useHabitStore.setState({
      completedHabitIds: [],
    });
    useBuddyStore.setState({
      state: 'idle',
    });
  });

  test('completing a mission updates the bolt balance on Home screen', async () => {
    // 1. Check initial balance on Home Screen
    const { getByText, unmount } = render(<HomeScreen />);
    expect(getByText('10')).toBeTruthy(); // BoltCounter balance
    unmount();

    // 2. Start and Finish Mission on Mission Screen
    const { getByTestId } = render(<MissionScreen />);

    // Start
    const startBtn = getByTestId('start-mission-button');
    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Finish (button testID is 'done-button' when mission is active)
    const finishBtn = getByTestId('done-button');
    await act(async () => {
      fireEvent.click(finishBtn);
    });

    expect(habitLogService.logMissionResult).toHaveBeenCalled();

    // Wait for state update
    await waitFor(() => {
      expect(useAuthStore.getState().profile?.bolt_balance).toBe(11);
    });
    unmount();

    // 3. Verify updated balance on Home Screen
    const { getByText: getByTextNew } = render(<HomeScreen />);
    expect(getByTextNew('11')).toBeTruthy();
  });
});
