import { useTheme } from './context';
import { LegacyColorKeys } from './types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: LegacyColorKeys
) {
  try {
    const { theme } = useTheme();
    const colorFromProps = props[theme.id];
    
    if (colorFromProps) {
      return colorFromProps;
    } else {
      return theme.colors[colorName];
    }
  } catch (e) {
    const theme = useColorScheme() ?? 'light';
    const colorFromProps = props[theme];
    
    if (colorFromProps) {
      return colorFromProps;
    } else {
      return Colors[theme][colorName as keyof typeof Colors.light];
    }
  }
}

export function useSpacing() {
  const { theme } = useTheme();
  return theme.spacing;
}

export function useRadius() {
  const { theme } = useTheme();
  return theme.radius;
}

export function useTypography() {
  const { theme } = useTheme();
  return theme.typography;
}