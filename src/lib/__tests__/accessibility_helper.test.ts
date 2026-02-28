import { describe, it, expect, vi } from 'vitest';
import { AccessibilityInfo } from 'react-native';
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

  it('prefixes buddy announcements', () => {
    accessibilityHelper.announceBuddy('I am happy');
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Buddy update: I am happy',
    );
  });
});
