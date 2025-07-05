import React, { useEffect, useCallback, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  BackHandler,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useTheme, useSpacing, useRadius } from '@/theme';
import { ThemedText } from '@/components/ThemedText';
import { X } from 'lucide-react';
import { TouchTarget } from './TouchTarget';

export type PanelVariant = 'sheet' | 'sidebar' | 'modal' | 'fullscreen';
export type SnapPoint = number | string;

export interface AdaptivePanelProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;

  // Content
  title?: string;
  subtitle?: string;

  // Layout behavior
  variant?: PanelVariant | 'auto';
  snapPoints?: SnapPoint[];
  initialSnap?: number;

  // Interaction
  enableDrag?: boolean;
  enableBackdropDismiss?: boolean;
  enableHardwareBackPress?: boolean;

  // Styling
  maxWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;

  // Callbacks
  onSnapChange?: (index: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DEFAULT_SNAP_POINTS: SnapPoint[] = ['25%', '50%', '85%'];

export const AdaptivePanel: React.FC<AdaptivePanelProps> = ({
  children,
  isVisible,
  onClose,
  title,
  subtitle,
  variant = 'auto',
  snapPoints = DEFAULT_SNAP_POINTS,
  initialSnap = 1,
  enableDrag = true,
  enableBackdropDismiss = true,
  enableHardwareBackPress = true,
  maxWidth = 400,
  backgroundColor,
  borderRadius,
  accessibilityLabel,
  accessibilityHint,
  onSnapChange,
  onDragStart,
  onDragEnd,
}) => {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const insets = useSafeAreaInsets();
  const {
    isMobile,
    isTablet,
    isDesktop,
    modalStyle,
    screenHeight,
    screenWidth,
    touchFirst,
  } = useAdaptiveDesign();

  // State
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);

  // Animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  // Determine actual variant to use
  const actualVariant =
    variant === 'auto' ? (isMobile ? 'sheet' : isDesktop ? 'sidebar' : 'modal') : variant;

  // Calculate snap positions
  const snapPositions = React.useMemo(() => {
    return snapPoints.map((point) => {
      if (typeof point === 'string' && point.endsWith('%')) {
        const percentage = parseFloat(point) / 100;
        return screenHeight * (1 - percentage);
      }
      return typeof point === 'number' ? screenHeight - point : screenHeight * 0.5;
    });
  }, [snapPoints, screenHeight]);

  // Initialize panel position
  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 200 });
      backdropOpacity.value = withTiming(0.5, { duration: 200 });

      if (actualVariant === 'sheet') {
        translateY.value = withSpring(snapPositions[currentSnapIndex], {
          damping: 20,
          stiffness: 300,
        });
      }
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });

      if (actualVariant === 'sheet') {
        translateY.value = withSpring(screenHeight, {
          damping: 20,
          stiffness: 300,
        });
      }
    }
  }, [isVisible, actualVariant, snapPositions, currentSnapIndex]);

  // Hardware back press handling
  useEffect(() => {
    if (!enableHardwareBackPress || Platform.OS === 'ios') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible, enableHardwareBackPress, onClose]);

  // Gesture handler
  const handleGesture = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      if (!enableDrag || actualVariant !== 'sheet') return;

      const { translationY, velocityY } = event.nativeEvent;
      const newPosition = snapPositions[currentSnapIndex] + translationY;

      // Constrain to bounds
      const minY = snapPositions[snapPositions.length - 1];
      const maxY = screenHeight;

      translateY.value = Math.max(minY, Math.min(maxY, newPosition));
    },
    [enableDrag, actualVariant, snapPositions, currentSnapIndex]
  );

  const handleGestureEnd = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      if (!enableDrag || actualVariant !== 'sheet') return;

      const { translationY, velocityY } = event.nativeEvent;
      const currentPosition = translateY.value;

      // Determine target snap point
      let targetIndex = currentSnapIndex;

      if (Math.abs(velocityY) > 500) {
        // High velocity - snap to direction of movement
        if (velocityY > 0) {
          targetIndex = Math.max(0, currentSnapIndex - 1);
        } else {
          targetIndex = Math.min(snapPositions.length - 1, currentSnapIndex + 1);
        }
      } else {
        // Low velocity - snap to nearest point
        let minDistance = Infinity;
        snapPositions.forEach((position, index) => {
          const distance = Math.abs(currentPosition - position);
          if (distance < minDistance) {
            minDistance = distance;
            targetIndex = index;
          }
        });
      }

      // Check if should dismiss
      if (targetIndex === 0 && translationY > 100) {
        runOnJS(onClose)();
        return;
      }

      // Animate to target position
      translateY.value = withSpring(snapPositions[targetIndex], {
        damping: 20,
        stiffness: 300,
      });

      // Update current snap index
      if (targetIndex !== currentSnapIndex) {
        runOnJS(setCurrentSnapIndex)(targetIndex);
        runOnJS(onSnapChange)?.(targetIndex);
      }

      runOnJS(setIsDragging)(false);
      runOnJS(onDragEnd)?.();
    },
    [
      enableDrag,
      actualVariant,
      snapPositions,
      currentSnapIndex,
      onClose,
      onSnapChange,
      onDragEnd,
    ]
  );

  // Gesture start
  const handleGestureStart = useCallback(() => {
    setIsDragging(true);
    onDragStart?.();
  }, [onDragStart]);

  // Backdrop press
  const handleBackdropPress = useCallback(() => {
    if (enableBackdropDismiss) {
      onClose();
    }
  }, [enableBackdropDismiss, onClose]);

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const panelStyle = useAnimatedStyle(() => {
    if (actualVariant === 'sheet') {
      return {
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
      };
    }
    return {
      opacity: opacity.value,
    };
  });

  // Render header
  const renderHeader = () => (
    <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
      <View style={styles.headerContent}>
        {title && (
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
        )}
        {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
      </View>

      <TouchTarget
        onPress={onClose}
        variant="minimal"
        size="small"
        accessibilityLabel="Close panel"
        accessibilityRole="button"
      >
        <X size={24} color={theme.colors.text} />
      </TouchTarget>
    </View>
  );

  // Render drag handle for sheets
  const renderDragHandle = () => (
    <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
  );

  // Render content
  const renderContent = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: spacing.md }]}
      showsVerticalScrollIndicator={!touchFirst}
      bounces={actualVariant === 'sheet'}
    >
      {children}
    </ScrollView>
  );

  // Desktop sidebar
  if (actualVariant === 'sidebar') {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={onClose}
      >
        <View style={styles.sidebarContainer}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
          </Animated.View>

          <Animated.View
            style={[
              styles.sidebar,
              {
                maxWidth,
                backgroundColor: backgroundColor || theme.colors.background,
                borderRadius: borderRadius || radius.lg,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: spacing.md,
                paddingRight: spacing.md,
              },
              panelStyle,
            ]}
          >
            {renderHeader()}
            {renderContent()}
          </Animated.View>
        </View>
      </Modal>
    );
  }

  // Mobile bottom sheet
  if (actualVariant === 'sheet') {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={onClose}
      >
        <GestureHandlerRootView style={styles.gestureContainer}>
          <View style={styles.sheetContainer}>
            <Animated.View style={[styles.backdrop, backdropStyle]}>
              <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
            </Animated.View>

            <PanGestureHandler
              onGestureEvent={handleGesture}
              onHandlerStateChange={handleGestureEnd}
              onBegan={handleGestureStart}
            >
              <Animated.View
                style={[
                  styles.sheet,
                  {
                    backgroundColor: backgroundColor || theme.colors.background,
                    borderRadius: borderRadius || radius.lg,
                    paddingBottom: insets.bottom,
                  },
                  panelStyle,
                ]}
              >
                {enableDrag && renderDragHandle()}
                {renderHeader()}
                {renderContent()}
              </Animated.View>
            </PanGestureHandler>
          </View>
        </GestureHandlerRootView>
      </Modal>
    );
  }

  // Fallback modal
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modal,
            {
              maxWidth,
              backgroundColor: backgroundColor || theme.colors.background,
              borderRadius: borderRadius || radius.lg,
              padding: spacing.md,
            },
            panelStyle,
          ]}
        >
          {renderHeader()}
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Gesture container
  gestureContainer: {
    flex: 1,
  },

  // Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // Sidebar
  sidebarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sidebar: {
    height: '100%',
    minWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },

  // Bottom sheet
  sheetContainer: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },

  // Drag handle
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
});
