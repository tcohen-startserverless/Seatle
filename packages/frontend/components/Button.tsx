import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps {
  onPress: () => void;
  children: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export function Button({
  onPress,
  children,
  icon,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  style,
}: ButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  let buttonStyle = {};
  let textStyle = {};

  switch (variant) {
    case 'primary':
      buttonStyle = { backgroundColor: tintColor };
      textStyle = { color: backgroundColor };
      break;
    case 'secondary':
      buttonStyle = { backgroundColor: 'rgba(0,0,0,0.05)' };
      textStyle = { color: textColor };
      break;
    case 'outline':
      buttonStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: tintColor,
      };
      textStyle = { color: tintColor };
      break;
  }

  return (
    <Pressable
      style={[
        styles.button,
        buttonStyle,
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? backgroundColor : tintColor}
          size="small"
        />
      ) : (
        <>
          {icon && <span style={styles.iconContainer}>{icon}</span>}
          <ThemedText style={[styles.text, textStyle]}>{children}</ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
