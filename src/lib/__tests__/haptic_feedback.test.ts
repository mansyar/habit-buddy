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
  beforeEach(() => {
    vi.clearAllMocks();
    hapticFeedback.setMute(false);
  });

  it('triggers light impact feedback', async () => {
    await hapticFeedback.impact('light');
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('triggers heavy impact feedback', async () => {
    await hapticFeedback.impact('heavy');
    expect(Haptics.impactAsync).toHaveBeenCalledWith('heavy');
  });

  it('triggers medium impact feedback (default)', async () => {
    await hapticFeedback.impact();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  it('triggers success notification feedback (default)', async () => {
    await hapticFeedback.notification();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('triggers warning notification feedback', async () => {
    await hapticFeedback.notification('warning');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('warning');
  });

  it('triggers error notification feedback', async () => {
    await hapticFeedback.notification('error');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('error');
  });

  it('triggers selection feedback', async () => {
    await hapticFeedback.selection();
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it('respects mute state', async () => {
    hapticFeedback.setMute(true);
    await hapticFeedback.impact();
    await hapticFeedback.notification();
    await hapticFeedback.selection();

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });

  it('handles impact errors gracefully', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(Haptics.impactAsync).mockRejectedValueOnce(new Error('Haptic error'));

    await hapticFeedback.impact();
    expect(warnSpy).toHaveBeenCalledWith('Haptic impact failed:', expect.any(Error));
    warnSpy.mockRestore();
  });

  it('handles notification errors gracefully', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(Haptics.notificationAsync).mockRejectedValueOnce(new Error('Haptic error'));

    await hapticFeedback.notification();
    expect(warnSpy).toHaveBeenCalledWith('Haptic notification failed:', expect.any(Error));
    warnSpy.mockRestore();
  });

  it('handles selection errors gracefully', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(Haptics.selectionAsync).mockRejectedValueOnce(new Error('Haptic error'));

    await hapticFeedback.selection();
    expect(warnSpy).toHaveBeenCalledWith('Haptic selection failed:', expect.any(Error));
    warnSpy.mockRestore();
  });
});
