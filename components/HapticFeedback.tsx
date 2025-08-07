import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Utility function to trigger haptic feedback for different actions:
 * Options:
 * 'success' for success feedback, 
 * 'error' for error feedback, 
 * 'light' for light impact
 * 'medium' for medium impact,
 * 'heavy' for heavy impact.
 */
export function triggerHaptic(type: 'success' | 'error' | 'light' | 'medium' | 'heavy' = 'light') {
  // Haptics work on iOS and Android
  if (Platform.OS !== 'web') {
    switch (type) {
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  }
}
