import { useCallback, useEffect, useRef } from 'react';
import { PanResponder, Platform } from 'react-native';

export const GESTURE_CONFIG = {
  longPressDelay: 500,
  doubleTapDelay: 300,
  pinchThreshold: 0.1,
  panThreshold: 10,
  swipeVelocityThreshold: 0.5,
  shakeMagnitudeThreshold: 1.5,
  forceThreshold: 0.5, // iOS only
} as const;

export interface GesturePosition {
  x: number;
  y: number;
}

export interface GestureEvent {
  position: GesturePosition;
  timestamp: number;
  force?: number; // iOS only
}

export interface PinchGestureEvent extends GestureEvent {
  scale: number;
  velocity: number;
}

export interface PanGestureEvent extends GestureEvent {
  translation: GesturePosition;
  velocity: GesturePosition;
}

export interface SwipeGestureEvent extends GestureEvent {
  direction: 'up' | 'down' | 'left' | 'right';
  velocity: number;
}

export interface GestureHandlers {
  onTap?: (event: GestureEvent) => void;
  onDoubleTap?: (event: GestureEvent) => void;
  onLongPress?: (event: GestureEvent) => void;
  onPinch?: (event: PinchGestureEvent) => void;
  onPan?: (event: PanGestureEvent) => void;
  onSwipe?: (event: SwipeGestureEvent) => void;
  onForceTouch?: (event: GestureEvent) => void; // iOS only
}

export interface GestureState {
  isGestureActive: boolean;
  activeGesture: string | null;
  initialTouch: GesturePosition | null;
  lastTap: { position: GesturePosition; timestamp: number } | null;
  longPressTimer: NodeJS.Timeout | null;
  touches: GesturePosition[];
}

export function useGestureRecognizer(handlers: GestureHandlers) {
  const gestureState = useRef<GestureState>({
    isGestureActive: false,
    activeGesture: null,
    initialTouch: null,
    lastTap: null,
    longPressTimer: null,
    touches: [],
  });

  const clearLongPressTimer = useCallback(() => {
    if (gestureState.current.longPressTimer) {
      clearTimeout(gestureState.current.longPressTimer);
      gestureState.current.longPressTimer = null;
    }
  }, []);

  const createGestureEvent = useCallback((evt: any): GestureEvent => {
    const { locationX, locationY, force } = evt.nativeEvent;
    return {
      position: { x: locationX, y: locationY },
      timestamp: Date.now(),
      force: Platform.OS === 'ios' ? force : undefined,
    };
  }, []);

  const handleTap = useCallback(
    (event: GestureEvent) => {
      const now = Date.now();
      const { lastTap } = gestureState.current;

      if (
        lastTap &&
        now - lastTap.timestamp < GESTURE_CONFIG.doubleTapDelay &&
        Math.abs(event.position.x - lastTap.position.x) < 20 &&
        Math.abs(event.position.y - lastTap.position.y) < 20
      ) {
        // Double tap detected
        gestureState.current.lastTap = null;
        handlers.onDoubleTap?.(event);
      } else {
        // Single tap
        gestureState.current.lastTap = { position: event.position, timestamp: now };
        setTimeout(() => {
          if (gestureState.current.lastTap?.timestamp === now) {
            handlers.onTap?.(event);
            gestureState.current.lastTap = null;
          }
        }, GESTURE_CONFIG.doubleTapDelay);
      }
    },
    [handlers]
  );

  const handleLongPress = useCallback(
    (event: GestureEvent) => {
      handlers.onLongPress?.(event);
    },
    [handlers]
  );

  const handlePinch = useCallback(
    (scale: number, velocity: number, event: GestureEvent) => {
      const pinchEvent: PinchGestureEvent = {
        ...event,
        scale,
        velocity,
      };
      handlers.onPinch?.(pinchEvent);
    },
    [handlers]
  );

  const handlePan = useCallback(
    (translation: GesturePosition, velocity: GesturePosition, event: GestureEvent) => {
      const panEvent: PanGestureEvent = {
        ...event,
        translation,
        velocity,
      };
      handlers.onPan?.(panEvent);
    },
    [handlers]
  );

  const handleSwipe = useCallback(
    (
      direction: SwipeGestureEvent['direction'],
      velocity: number,
      event: GestureEvent
    ) => {
      const swipeEvent: SwipeGestureEvent = {
        ...event,
        direction,
        velocity,
      };
      handlers.onSwipe?.(swipeEvent);
    },
    [handlers]
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, panGestureState) => {
        const { dx, dy } = panGestureState;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance > GESTURE_CONFIG.panThreshold;
      },

      onPanResponderGrant: (evt) => {
        const event = createGestureEvent(evt);
        gestureState.current.isGestureActive = true;
        gestureState.current.initialTouch = event.position;
        gestureState.current.touches = [event.position];

        // Start long press timer
        gestureState.current.longPressTimer = setTimeout(() => {
          if (gestureState.current.isGestureActive) {
            gestureState.current.activeGesture = 'longPress';
            handleLongPress(event);
          }
        }, GESTURE_CONFIG.longPressDelay);

        // Handle force touch (iOS only)
        if (
          Platform.OS === 'ios' &&
          event.force &&
          event.force > GESTURE_CONFIG.forceThreshold
        ) {
          handlers.onForceTouch?.(event);
        }
      },

      onPanResponderMove: (evt, panGestureState) => {
        const event = createGestureEvent(evt);
        const { dx, dy, vx, vy } = panGestureState;

        // Clear long press timer on movement
        clearLongPressTimer();

        // Check for multi-touch (pinch)
        if (evt.nativeEvent.touches?.length === 2) {
          const touches = evt.nativeEvent.touches;
          const touch1 = touches[0];
          const touch2 = touches[1];

          if (touch1 && touch2) {
            const distance = Math.sqrt(
              Math.pow(touch1.pageX - touch2.pageX, 2) +
                Math.pow(touch1.pageY - touch2.pageY, 2)
            );

            if (gestureState.current.touches.length === 2) {
              const touch1 = gestureState.current.touches[0];
              const touch2 = gestureState.current.touches[1];

              if (touch1 && touch2) {
                const initialDistance = Math.sqrt(
                  Math.pow(touch1.x - touch2.x, 2) + Math.pow(touch1.y - touch2.y, 2)
                );

                const scale = distance / initialDistance;
                const velocity = Math.sqrt(vx * vx + vy * vy);

                if (Math.abs(scale - 1) > GESTURE_CONFIG.pinchThreshold) {
                  gestureState.current.activeGesture = 'pinch';
                  handlePinch(scale, velocity, event);
                }
              }
            }
          }
        } else if (evt.nativeEvent.touches?.length === 1) {
          // Single touch - pan gesture
          const translation = { x: dx, y: dy };
          const velocity = { x: vx, y: vy };

          gestureState.current.activeGesture = 'pan';
          handlePan(translation, velocity, event);
        }
      },

      onPanResponderRelease: (evt, panGestureState) => {
        const event = createGestureEvent(evt);
        const { dx, dy, vx, vy } = panGestureState;

        clearLongPressTimer();

        // Check for swipe gesture
        const velocity = Math.sqrt(vx * vx + vy * vy);
        if (velocity > GESTURE_CONFIG.swipeVelocityThreshold) {
          let direction: SwipeGestureEvent['direction'];

          if (Math.abs(vx) > Math.abs(vy)) {
            direction = vx > 0 ? 'right' : 'left';
          } else {
            direction = vy > 0 ? 'down' : 'up';
          }

          handleSwipe(direction, velocity, event);
        } else if (
          gestureState.current.activeGesture === null &&
          Math.abs(dx) < GESTURE_CONFIG.panThreshold &&
          Math.abs(dy) < GESTURE_CONFIG.panThreshold
        ) {
          // Tap gesture
          handleTap(event);
        }

        // Reset state
        gestureState.current.isGestureActive = false;
        gestureState.current.activeGesture = null;
        gestureState.current.initialTouch = null;
        gestureState.current.touches = [];
      },

      onPanResponderTerminate: () => {
        clearLongPressTimer();
        gestureState.current.isGestureActive = false;
        gestureState.current.activeGesture = null;
        gestureState.current.initialTouch = null;
        gestureState.current.touches = [];
      },
    })
  ).current;

  return {
    panHandlers: panResponder.panHandlers,
    gestureState: gestureState.current,
  };
}

export function useShakeGesture(onShake: () => void) {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    // Note: Shake detection would require a native module or accelerometer
    // For now, this is a placeholder for the shake gesture
    // In a real implementation, you would use react-native-shake or similar

    const handleShake = () => {
      onShake();
    };

    // Return cleanup function
    return () => {
      // Cleanup shake listener
    };
  }, [onShake]);
}

export function calculateDistance(
  point1: GesturePosition,
  point2: GesturePosition
): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateAngle(point1: GesturePosition, point2: GesturePosition): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

export function getSwipeDirection(
  start: GesturePosition,
  end: GesturePosition
): SwipeGestureEvent['direction'] {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}

export function isWithinThreshold(
  point1: GesturePosition,
  point2: GesturePosition,
  threshold: number
): boolean {
  return calculateDistance(point1, point2) <= threshold;
}
