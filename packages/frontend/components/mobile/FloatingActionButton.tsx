import React, { useRef, useEffect } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { useTheme, useSpacing } from '@/theme';
import { MOBILE_SPECS } from '@/utils/responsive';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  visible?: boolean;
  style?: ViewStyle;
  size?: number;
  disabled?: boolean;
}

export function FloatingActionButton({
  onPress,
  icon,
  visible = true,
  style,
  size = 56,
  disabled = false,
}: FloatingActionButtonProps) {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { navigationStyle, isTablet, screenWidth } = useAdaptiveDesign();
  const tabBarHeight = useBottomTabBarHeight();
  const scaleValue = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const opacityValue = useRef(new Animated.Value(visible ? 1 : 0)).current;

  // Calculate bottom position accounting for actual tab bar height
  // Treat medium screens like mobile - use bottom tabs positioning
  const bottomSpacing =
    navigationStyle === 'bottom-tabs' ||
    isTablet ||
    (screenWidth >= 768 && screenWidth <= 1200)
      ? insets.bottom + spacing.md + tabBarHeight - insets.bottom
      : insets.bottom + spacing.md;

  // Animate visibility changes
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: visible ? 1 : 0,
        ...MOBILE_SPECS.springConfig,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: visible ? 1 : 0,
        duration: MOBILE_SPECS.transitionDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, scaleValue, opacityValue]);

  const handlePress = () => {
    if (!disabled) {
      // Add scale animation on press
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: bottomSpacing,
          right: 16,
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
        style,
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: disabled ? theme.colors.border : theme.colors.tint,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        android_ripple={{
          color: 'rgba(255, 255, 255, 0.2)',
          borderless: true,
          radius: size / 2,
        }}
        testID="floating-action-button"
      >
        <View style={styles.iconContainer}>{icon}</View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99999,
    elevation: 999,
    pointerEvents: 'box-none',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: MOBILE_SPECS.minimumTouchTarget,
    minHeight: MOBILE_SPECS.minimumTouchTarget,
    pointerEvents: 'auto',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
