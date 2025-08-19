/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { COLORS } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Only allow simple string color properties from COLORS
type ColorKeys = 'background' | 'surface' | 'text' | 'textMuted' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'border';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKeys
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Return the color from COLORS, ensuring it's a string
    return COLORS[colorName] as string;
  }
}
