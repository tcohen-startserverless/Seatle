import { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

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
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      'inputBackground'
    );
    const color = useThemeColor({}, 'inputText');
    const borderColor = useThemeColor({}, 'border');
    const placeholderColor = useThemeColor({}, 'placeholderText');

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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 46,
  },
  webInput: {
    // @ts-ignore - Web-only styles
    outlineStyle: 'none', // Removes default focus outline on web
    appearance: 'none', // Removes default styling on some browsers
  },
});
