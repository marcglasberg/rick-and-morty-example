import { State } from "@/business/state/state";
import { useSelect } from "kiss-for-react";
import { useColorScheme } from "react-native";

/**
 * Custom hook that combines the system color-scheme 
 * with the user's selected theme from state.
 * 
 * This hook handles the proper theme fallback mechanism 
 * and is used throughout the app.
 */
export function useTheme(): 'light' | 'dark' {

  // Get theme from Kiss, with system color scheme as the fallback.
  const stateColorScheme = useSelect((state: State) => state.colorScheme);
  const systemColorScheme = useColorScheme();

  // Choose the appropriate color scheme.
  let theme = (stateColorScheme !== null ? stateColorScheme : systemColorScheme || 'dark') as 'light' | 'dark';

  return theme;
}

/** Custom hook that returns true if the current theme is 'dark'. */
export function useIsDarkTheme(): boolean {
  return useTheme() === 'dark';
}
