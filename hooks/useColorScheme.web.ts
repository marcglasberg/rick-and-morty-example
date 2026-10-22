import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  // Try to detect the preferred color scheme from the media query
  // This allows initial render to more likely match the user's preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  // If we can't detect it, return null so the app can handle the fallback
  return null;
}
