import { Text, type TextProps, StyleSheet, TextStyle } from 'react-native';

import { useTheme, useTypography } from '@/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme();
  const typography = useTypography();
  const color = theme.colors.text;

  const textStyles: Record<string, TextStyle> = {
    default: {
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.md,
    },
    defaultSemiBold: {
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.md,
      fontWeight: '600',
    },
    title: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: 'bold',
      lineHeight: typography.lineHeight['3xl'],
    },
    subtitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: 'bold',
    },
    link: {
      lineHeight: 30,
      fontSize: typography.fontSize.md,
      color: theme.colors.info,
    },
  };

  return (
    <Text
      style={[
        { color },
        textStyles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({});
