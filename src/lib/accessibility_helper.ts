import { AccessibilityInfo, Platform } from 'react-native';

class AccessibilityHelper {
  /**
   * Proactively announces a message to screen reader users (VoiceOver/TalkBack).
   * Useful for state changes that don't result in focus changes.
   */
  announce(message: string) {
    if (Platform.OS === 'web') return;
    AccessibilityInfo.announceForAccessibility(message);
  }

  /**
   * Standardized announcement for Buddy state transitions.
   */
  announceBuddy(update: string) {
    this.announce(`Buddy update: ${update}`);
  }

  /**
   * Announcements for mission progress/completion.
   */
  announceMission(status: string) {
    this.announce(`Mission status: ${status}`);
  }

  /**
   * Announcements for Gold Bolt updates.
   */
  announceBolts(balance: number, change?: number) {
    if (change !== undefined) {
      const verb = change > 0 ? 'earned' : 'spent';
      this.announce(`You ${verb} ${Math.abs(change)} Gold Bolts! New balance: ${balance}`);
    } else {
      this.announce(`Gold Bolt balance: ${balance}`);
    }
  }
}

export const accessibilityHelper = new AccessibilityHelper();
