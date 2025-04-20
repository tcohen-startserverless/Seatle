import { Colors } from '@/constants/Colors';
import { ThemeConfig, Typography, Spacing, Radius } from './types';

const typography: Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20, 
    '2xl': 24,
    '3xl': 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 30,
    '2xl': 32,
    '3xl': 40,
  },
};

const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

const radius: Radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

export const lightTheme: ThemeConfig = {
  id: 'light',
  colors: {
    ...Colors.light,
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF3B30',
    info: '#0A7EA4',
  },
  typography,
  spacing,
  radius,
};

export const darkTheme: ThemeConfig = {
  id: 'dark',
  colors: {
    ...Colors.dark,
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF3B30',
    info: '#0A7EA4',
  },
  typography,
  spacing,
  radius,
};

export const defaultTheme = lightTheme;