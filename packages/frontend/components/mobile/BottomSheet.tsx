import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { MOBILE_SPECS } from '@/utils/responsive';

export type BottomSheetState = 'collapsed' | 'peek' | 'expanded';

interface BottomSheetProps {
  state: BottomSheetState;
  onStateChange: (state: BottomSheetState) => void;
  children: React.ReactNode;
  peekHeight?: number;
  expandedHeight?: number;
  backdropOpacity?: number;
  enableBackdropDismiss?: boolean;
  enableGestures?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function BottomSheet({
  state,
  onStateChange,
  children,
  peekHeight = SCREEN_HEIGHT * 0.25,
  expandedHeight = SCREEN_HEIGHT * 0.5,
  backdropOpacity = 0.3,
  enableBackdropDismiss = true,
  enableGestures = true,
  style,
  contentStyle,
}: BottomSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacityValue = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  // Calculate positions
  const collapsedPosition = SCREEN_HEIGHT;
  const peekPosition = SCREEN_HEIGHT - peekHeight - insets.bottom;
  const expandedPosition = SCREEN_HEIGHT - expandedHeight - insets.bottom;

  // Get target position based on state
  const getTargetPosition = useCallback(
    (targetState: BottomSheetState) => {
      switch (targetState) {
        case 'collapsed':
          return collapsedPosition;
        case 'peek':
          return peekPosition;
        case 'expanded':
          return expandedPosition;
        default:
          return collapsedPosition;
      }
    },
    [collapsedPosition, peekPosition, expandedPosition]
  );

  // Animate to target state
  const animateToState = useCallback(
    (targetState: BottomSheetState) => {
      const targetPosition = getTargetPosition(targetState);
      const targetBackdropOpacity = targetState === 'collapsed' ? 0 : backdropOpacity;

      if (targetState === 'collapsed') {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: targetPosition,
            ...MOBILE_SPECS.springConfig,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacityValue, {
            toValue: targetBackdropOpacity,
            duration: MOBILE_SPECS.transitionDuration,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsVisible(false);
        });
      } else {
        if (!isVisible) {
          setIsVisible(true);
        }

        Animated.parallel([
          Animated.spring(translateY, {
            toValue: targetPosition,
            ...MOBILE_SPECS.springConfig,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacityValue, {
            toValue: targetBackdropOpacity,
            duration: MOBILE_SPECS.transitionDuration,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    [translateY, backdropOpacityValue, getTargetPosition, backdropOpacity, isVisible]
  );

  // Pan gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return enableGestures && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const currentPosition = getTargetPosition(state);
        const newPosition = Math.max(
          expandedPosition,
          Math.min(collapsedPosition, currentPosition + gestureState.dy)
        );

        translateY.setValue(newPosition);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        const currentPosition = getTargetPosition(state);
        const newPosition = currentPosition + dy;

        // Determine target state based on gesture
        let targetState: BottomSheetState;

        if (vy > 0.5) {
          // Fast swipe down
          targetState = state === 'expanded' ? 'peek' : 'collapsed';
        } else if (vy < -0.5) {
          // Fast swipe up
          targetState = state === 'peek' ? 'expanded' : 'peek';
        } else {
          // Slow drag - determine by position
          const peekThreshold = (peekPosition + expandedPosition) / 2;
          const collapseThreshold = (peekPosition + collapsedPosition) / 2;

          if (newPosition < peekThreshold) {
            targetState = 'expanded';
          } else if (newPosition < collapseThreshold) {
            targetState = 'peek';
          } else {
            targetState = 'collapsed';
          }
        }

        onStateChange(targetState);
      },
    })
  ).current;

  // Animate when state changes
  useEffect(() => {
    animateToState(state);
  }, [state, animateToState]);

  // Initialize position
  useEffect(() => {
    translateY.setValue(getTargetPosition(state));
    if (state !== 'collapsed') {
      setIsVisible(true);
    }
  }, []);

  const handleBackdropPress = useCallback(() => {
    if (enableBackdropDismiss && state !== 'collapsed') {
      onStateChange('collapsed');
    }
  }, [enableBackdropDismiss, state, onStateChange]);

  if (!isVisible && state === 'collapsed') {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacityValue,
            },
          ]}
        >
          <Pressable style={styles.backdropPressable} onPress={handleBackdropPress} />
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.radius.lg,
              borderTopRightRadius: theme.radius.lg,
              transform: [{ translateY }],
              paddingBottom: insets.bottom,
            },
            style,
          ]}
          {...(enableGestures ? panResponder.panHandlers : {})}
        >
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: theme.colors.border,
                },
              ]}
            />
          </View>

          {/* Content */}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    minHeight: 100,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
