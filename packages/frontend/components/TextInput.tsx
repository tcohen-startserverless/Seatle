import { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';
import { useTheme, useRadius, useSpacing, useTypography } from '@/theme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ThemedTextInputProps = TextInputProps &
  ThemeProps & {
    style?: TextInputProps['style'];
  };

export const TextInput = forwardRef<RNTextInput, ThemedTextInputProps>(
  ({ style, lightColor, darkColor, ...props }, ref) => {
    const { theme } = useTheme();
    const radius = useRadius();
    const spacing = useSpacing();
    const typography = useTypography();
    
    const backgroundColor = theme.colors.inputBackground;
    const color = theme.colors.inputText;
    const borderColor = theme.colors.border;
    const placeholderColor = theme.colors.placeholderText;

    return (
      <RNTextInput
        ref={ref}
        placeholderTextColor={placeholderColor}
        style={[
          styles.input,
          {
            backgroundColor,
            color,
            borderColor,
            borderRadius: radius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.md,
            minHeight: 46,
          },
          Platform.OS === 'web' && styles.webInput,
          style,
        ]}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  webInput: {
    // @ts-ignore - Web-only styles
    outlineStyle: 'none', // Removes default focus outline on web
    appearance: 'none', // Removes default styling on some browsers
  },
});
