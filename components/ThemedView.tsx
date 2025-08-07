import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'card';
};

export function ThemedView({ style, lightColor, darkColor, variant = 'default', ...otherProps }: ThemedViewProps) {
  
  // Use 'cardBackground' color key for card variant, otherwise use 'background'
  const colorKey = variant === 'card' ? 'cardBackground' : 'background';
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorKey);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
