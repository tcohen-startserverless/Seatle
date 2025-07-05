import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  AccessibilityRole,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useTheme, useSpacing, useRadius } from '@/theme';

// Touch target variants based on UX context
export type TouchTargetVariant = 'primary' | 'secondary' | 'minimal' | 'destructive';

// Interaction feedback types
export type FeedbackType = 'scale' | 'opacity' | 'highlight' | 'none';

export interface TouchTargetProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: TouchTargetVariant;
  feedback?: FeedbackType;
  size?: 'small' | 'medium' | 'large' | 'auto';
  shape?: 'rectangle' | 'circle' | 'rounded';
  accessibilityLabel: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityHint?: string;
  style?: ViewStyle;

  // Advanced interaction props
  onLongPress?: () => void;
  longPressDelay?: number;
  hapticFeedback?: boolean;

  // Loading/disabled states
  loading?: boolean;
  disabled?: boolean;

  // Visual customization
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  variant = 'primary',
  feedback = 'scale',
  size = 'medium',
  shape = 'rounded',
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  style,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  longPressDelay = 500,
  hapticFeedback = true,
  loading = false,
  disabled = false,
  backgroundColor,
  borderColor,
  borderWidth,
  ...pressableProps
}) => {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const { touchTargets, touchFirst, supportsHover, availableWidth } = useAdaptiveDesign();

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundColor_ = useSharedValue(0);

  // Haptic feedback (would need platform-specific implementation)
  const triggerHapticFeedback = () => {
    if (hapticFeedback && Platform.OS !== 'web') {
      // HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
    }
  };

  // Get size dimensions based on touch targets and actual window size
  const getSizeDimensions = () => {
    // Calculate responsive dimensions based on actual window width
    const getResponsiveSizes = () => {
      if (availableWidth >= 1400) {
        // Very large screens - smallest buttons
        return {
          small: { minWidth: 28, maxWidth: 60, minHeight: 28, padding: spacing.xs },
          medium: { minWidth: 32, maxWidth: 80, minHeight: 32, padding: spacing.xs },
          large: { minWidth: 36, maxWidth: 100, minHeight: 36, padding: spacing.sm },
          auto: { minWidth: 28, maxWidth: 120, minHeight: 28, padding: spacing.xs },
        };
      } else if (availableWidth >= 1200) {
        // Large desktop
        return {
          small: { minWidth: 32, maxWidth: 70, minHeight: 32, padding: spacing.xs },
          medium: { minWidth: 36, maxWidth: 90, minHeight: 36, padding: spacing.sm },
          large: { minWidth: 40, maxWidth: 120, minHeight: 40, padding: spacing.sm },
          auto: { minWidth: 32, maxWidth: 140, minHeight: 32, padding: spacing.xs },
        };
      } else if (availableWidth >= 1024) {
        // Desktop
        return {
          small: { minWidth: 32, maxWidth: 80, minHeight: 32, padding: spacing.xs },
          medium: { minWidth: 36, maxWidth: 120, minHeight: 36, padding: spacing.sm },
          large: { minWidth: 40, maxWidth: 160, minHeight: 40, padding: spacing.md },
          auto: { minWidth: 32, maxWidth: 200, minHeight: 32, padding: spacing.sm },
        };
      } else if (availableWidth >= 768) {
        // Tablet
        return {
          small: { minWidth: 36, maxWidth: 120, minHeight: 36, padding: spacing.sm },
          medium: { minWidth: 40, maxWidth: 180, minHeight: 40, padding: spacing.md },
          large: { minWidth: 44, maxWidth: 220, minHeight: 44, padding: spacing.md },
          auto: { minWidth: 36, maxWidth: 200, minHeight: 36, padding: spacing.sm },
        };
      } else {
        // Mobile - full touch target sizing
        return {
          small: {
            minWidth: touchTargets.min,
            maxWidth: 200,
            minHeight: touchTargets.min,
            padding: spacing.sm,
          },
          medium: {
            minWidth: touchTargets.comfortable,
            maxWidth: 250,
            minHeight: touchTargets.comfortable,
            padding: spacing.md,
          },
          large: {
            minWidth: touchTargets.spacious,
            maxWidth: 300,
            minHeight: touchTargets.spacious,
            padding: spacing.lg,
          },
          auto: {
            minWidth: touchTargets.min,
            maxWidth: 240,
            minHeight: touchTargets.min,
            padding: spacing.sm,
          },
        };
      }
    };

    const sizes = getResponsiveSizes();

    switch (size) {
      case 'small':
        return sizes.small;
      case 'medium':
        return sizes.medium;
      case 'large':
        return sizes.large;
      case 'auto':
        return sizes.auto;
      default:
        return sizes.medium;
    }
  };

  // Get variant styles with enhanced visual appeal
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: backgroundColor || theme.colors.tint,
          borderColor: borderColor || theme.colors.tint,
          borderWidth: borderWidth || 0,
          shadowColor: theme.colors.tint,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'secondary':
        return {
          backgroundColor: backgroundColor || theme.colors.card,
          borderColor: borderColor || theme.colors.border,
          borderWidth: borderWidth || 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: touchFirst ? 0.1 : 0.05,
          shadowRadius: touchFirst ? 3 : 2,
          elevation: touchFirst ? 2 : 1,
          // Subtle gradient effect with border
          borderTopColor: borderColor || 'rgba(255, 255, 255, 0.1)',
          borderBottomColor: borderColor || 'rgba(0, 0, 0, 0.1)',
        };
      case 'minimal':
        return {
          backgroundColor: backgroundColor || 'transparent',
          borderColor: borderColor || 'transparent',
          borderWidth: borderWidth || 0,
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        };
      case 'destructive':
        return {
          backgroundColor: backgroundColor || theme.colors.error,
          borderColor: borderColor || theme.colors.error,
          borderWidth: borderWidth || 0,
          shadowColor: theme.colors.error,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 2,
        };
      default:
        return {
          backgroundColor: backgroundColor || theme.colors.tint,
          borderColor: borderColor || theme.colors.tint,
          borderWidth: borderWidth || 0,
          shadowColor: theme.colors.tint,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        };
    }
  };

  // Get shape styles with enhanced visual appeal
  const getShapeStyles = () => {
    const sizeDimensions = getSizeDimensions();

    switch (shape) {
      case 'circle':
        return {
          borderRadius: Math.max(sizeDimensions.minWidth, sizeDimensions.minHeight) / 2,
          overflow: 'hidden',
        };
      case 'rectangle':
        return {
          borderRadius: 0,
          overflow: 'hidden',
        };
      case 'rounded':
        return {
          borderRadius: touchFirst ? radius.md : radius.sm,
          overflow: 'hidden',
          // Add subtle inner shadow effect
          ...(variant === 'secondary' && {
            borderStyle: 'solid',
          }),
        };
      default:
        return {
          borderRadius: radius.md,
          overflow: 'hidden',
        };
    }
  };

  // Handle press interactions with animation
  const handlePressIn = (event: any) => {
    // Trigger haptic feedback on main thread
    triggerHapticFeedback();

    if (Platform.OS === 'web') {
      // Direct value assignment for web to avoid worklet issues
      if (feedback === 'scale') {
        scale.value = 0.95;
      } else if (feedback === 'opacity') {
        opacity.value = 0.7;
      } else if (feedback === 'highlight') {
        backgroundColor_.value = 1;
      }
    } else {
      // Use animations on native platforms
      if (feedback === 'scale') {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      } else if (feedback === 'opacity') {
        opacity.value = withTiming(1, { duration: 150 });
      } else if (feedback === 'highlight') {
        backgroundColor_.value = withTiming(0, { duration: 150 });
      }
    }

    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    if (Platform.OS === 'web') {
      // Direct value assignment for web to avoid worklet issues
      if (feedback === 'scale') {
        scale.value = 1;
      } else if (feedback === 'opacity') {
        opacity.value = 1;
      } else if (feedback === 'highlight') {
        backgroundColor_.value = 0;
      }
    } else {
      // Use animations on native platforms
      if (feedback === 'scale') {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      } else if (feedback === 'opacity') {
        opacity.value = withTiming(1, { duration: 150 });
      } else if (feedback === 'highlight') {
        backgroundColor_.value = withTiming(0, { duration: 150 });
      }
    }

    onPressOut?.(event);
  };

  const handlePress = (event: any) => {
    if (disabled || loading) return;
    onPress?.(event);
  };

  const handleLongPress = () => {
    if (disabled || loading) return;
    triggerHapticFeedback();
    onLongPress?.();
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const variantStyles = getVariantStyles();
    const highlightColor = theme.colors.tint;

    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor:
        feedback === 'highlight'
          ? `rgba(${highlightColor}, ${backgroundColor_.value * 0.1})`
          : variantStyles.backgroundColor,
    };
  });

  // Combine all styles
  const combinedStyles = [
    styles.base,
    getSizeDimensions(),
    getVariantStyles(),
    getShapeStyles(),
    {
      opacity: disabled ? 0.5 : 1,
    },
    supportsHover && styles.hover,
    style,
  ];

  return (
    <AnimatedPressable
      style={[combinedStyles, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress ? handleLongPress : undefined}
      delayLongPress={longPressDelay}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      {...pressableProps}
    >
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Enhanced base styling for better visual appeal
  },
  hover: {
    // Enhanced web-specific hover styles
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    }),
  },
});
