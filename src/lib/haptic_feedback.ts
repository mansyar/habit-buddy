import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticImpactType = 'light' | 'medium' | 'heavy';
export type HapticNotificationType = 'success' | 'warning' | 'error';

class HapticFeedback {
  private isEnabled: boolean = true;

  constructor() {
    // In a real app, we might check user settings here
    this.isEnabled = Platform.OS !== 'web';
  }

  setMute(isMuted: boolean) {
    this.isEnabled = !isMuted;
  }

  async impact(style: HapticImpactType = 'medium') {
    if (!this.isEnabled) return;

    try {
      const hapticStyle = this.getImpactStyle(style);
      await Haptics.impactAsync(hapticStyle);
    } catch (error) {
      console.warn('Haptic impact failed:', error);
    }
  }

  async notification(type: HapticNotificationType = 'success') {
    if (!this.isEnabled) return;

    try {
      const hapticType = this.getNotificationType(type);
      await Haptics.notificationAsync(hapticType);
    } catch (error) {
      console.warn('Haptic notification failed:', error);
    }
  }

  async selection() {
    if (!this.isEnabled) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptic selection failed:', error);
    }
  }

  private getImpactStyle(style: HapticImpactType): Haptics.ImpactFeedbackStyle {
    switch (style) {
      case 'light':
        return Haptics.ImpactFeedbackStyle.Light;
      case 'heavy':
        return Haptics.ImpactFeedbackStyle.Heavy;
      case 'medium':
      default:
        return Haptics.ImpactFeedbackStyle.Medium;
    }
  }

  private getNotificationType(type: HapticNotificationType): Haptics.NotificationFeedbackType {
    switch (type) {
      case 'warning':
        return Haptics.NotificationFeedbackType.Warning;
      case 'error':
        return Haptics.NotificationFeedbackType.Error;
      case 'success':
      default:
        return Haptics.NotificationFeedbackType.Success;
    }
  }
}

export const hapticFeedback = new HapticFeedback();
