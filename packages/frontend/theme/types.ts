export interface ColorPalette {
  text: string;
  background: string;
  tint: string;
  icon: string;
  border: string;
  
  tabIconDefault: string;
  tabIconSelected: string;
  primaryRow: string;
  alternateRow: string;
  card: string;
  inputBackground: string;
  placeholderText: string;
  inputText: string;
  
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface Radius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  full: number;
}

export interface ThemeConfig {
  id: 'light' | 'dark';
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  radius: Radius;
}

export type LegacyColorKeys = keyof ColorPalette;