/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
const tintColorLight = '#0a7ea4';
const tintColorDark = '#0a7ea4';  // Using same blue as light mode for consistency
export type ThemeTypes = keyof typeof Colors;
export type ColorKeys = keyof typeof Colors.light;

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E6E8EB',
    primaryRow: '#fff',
    alternateRow: 'rgba(10, 126, 164, 0.1)',
    card: '#ffffff',
    inputBackground: '#F8F9FA',
    placeholderText: '#889096',
    inputText: '#11181C',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#2F3336',
    primaryRow: '#1f2123',
    alternateRow: 'rgba(255, 255, 255, 0.1)',
    card: '#1f2123',
    inputBackground: '#1A1D1E',
    placeholderText: '#687076',
    inputText: '#ECEDEE',
  },
};
