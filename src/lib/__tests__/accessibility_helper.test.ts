import { describe, it, expect, vi } from 'vitest';
import { AccessibilityInfo, Platform } from 'react-native';
import { accessibilityHelper } from '../accessibility_helper';

vi.mock('react-native', () => ({
  AccessibilityInfo: {
    announceForAccessibility: vi.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('AccessibilityHelper', () => {
  it('announces message for accessibility', () => {
    accessibilityHelper.announce('Hello World');
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith('Hello World');
  });

  it('does not announce on web', () => {
    // @ts-ignore - modifying mock
    Platform.OS = 'web';
    accessibilityHelper.announce('Hello Web');
    expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalledWith('Hello Web');
    // @ts-ignore - reset mock
    Platform.OS = 'ios';
  });

  it('prefixes buddy announcements', () => {
    accessibilityHelper.announceBuddy('I am happy');
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Buddy update: I am happy',
    );
  });

  it('prefixes mission announcements', () => {
    accessibilityHelper.announceMission('Started');
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Mission status: Started',
    );
  });

  it('announces bolt balance correctly', () => {
    accessibilityHelper.announceBolts(100);
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Gold Bolt balance: 100',
    );
  });

  it('announces earned bolts correctly', () => {
    accessibilityHelper.announceBolts(150, 50);
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'You earned 50 Gold Bolts! New balance: 150',
    );
  });

  it('announces spent bolts correctly', () => {
    accessibilityHelper.announceBolts(80, -20);
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'You spent 20 Gold Bolts! New balance: 80',
    );
  });
});
