import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCallback, useEffect, useState } from 'react';
import { useTheme, useThemeListener } from './context';
import { LegacyColorKeys } from './types';

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

export function useThemeUpdate() {
  const [, forceUpdate] = useState({});
  const { theme } = useTheme();

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useThemeListener(triggerUpdate);

  return { theme, triggerUpdate };
}

export function useThemeManager() {
  const { theme, colorScheme, setColorScheme, isManualOverride, isLoading } = useTheme();
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useThemeListener(triggerUpdate);

  const toggleTheme = useCallback(() => {
    const newTheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newTheme);
  }, [colorScheme, setColorScheme]);

  const setAutoTheme = useCallback(() => {
    setColorScheme('auto');
  }, [setColorScheme]);

  return {
    theme,
    colorScheme,
    setColorScheme,
    toggleTheme,
    setAutoTheme,
    isManualOverride,
    isLoading,
  };
}

export function useReactiveThemeColor(
  props: { light?: string; dark?: string },
  colorName: LegacyColorKeys
) {
  const { theme } = useThemeUpdate();

  try {
    const colorFromProps = props[theme.id];

    if (colorFromProps) {
      return colorFromProps;
    } else {
      return theme.colors[colorName];
    }
  } catch (e) {
    const fallbackTheme = useColorScheme() ?? 'light';
    const colorFromProps = props[fallbackTheme];

    if (colorFromProps) {
      return colorFromProps;
    } else {
      return Colors[fallbackTheme][colorName as keyof typeof Colors.light];
    }
  }
}

export function useReactiveSpacing() {
  const { theme } = useThemeUpdate();
  return theme.spacing;
}

export function useReactiveRadius() {
  const { theme } = useThemeUpdate();
  return theme.radius;
}

export function useReactiveTypography() {
  const { theme } = useThemeUpdate();
  return theme.typography;
}

export function useThemeRerender<T>(value: T, deps: any[] = []): T {
  const [state, setState] = useState(value);
  const { theme } = useTheme();

  useEffect(() => {
    setState(value);
  }, [value, theme.id, ...deps]);

  useThemeListener(() => {
    setState(value);
  });

  return state;
}
