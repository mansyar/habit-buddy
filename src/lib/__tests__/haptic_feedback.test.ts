import { describe, it, expect, vi } from 'vitest';
import * as Haptics from 'expo-haptics';
import { hapticFeedback } from '../haptic_feedback';

vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  selectionAsync: vi.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

describe('HapticFeedback', () => {
  it('triggers impact feedback', async () => {
    await hapticFeedback.impact('medium');
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  it('triggers notification feedback', async () => {
    await hapticFeedback.notification('success');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('triggers selection feedback', async () => {
    await hapticFeedback.selection();
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });
});
