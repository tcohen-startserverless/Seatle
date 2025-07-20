import { Animated, Pressable, StyleSheet, View, Platform, Vibration } from 'react-native';
import { Square, Circle } from 'lucide-react';
import { FurnitureElementsProps } from './types';
import { ThemedText } from '@/components/ThemedText';
import { getInitialsFromFullName } from '@/utils/nameHelpers';
import {
  useResponsiveInfo,
  getFurnitureHitArea,
  getTouchTargetSize,
} from '@/utils/responsive';

export function FurnitureElements({
  furniture,
  selectedItemId,
  cellSize,
  onItemPress,
  onChairAssign,
  onFurnitureSelect,
}: FurnitureElementsProps) {
  const responsiveInfo = useResponsiveInfo();
  const { isMobile } = responsiveInfo;

  const handlePress = (itemId: string, type: 'TABLE' | 'CHAIR') => {
    // Add haptic feedback on mobile
    if (isMobile && Platform.OS !== 'web') {
      try {
        Vibration.vibrate(10);
      } catch (error) {
        // Vibration might not be available, silently ignore
      }
    }

    if (onFurnitureSelect) {
      onFurnitureSelect(itemId);
    } else if (type === 'CHAIR' && onChairAssign) {
      onChairAssign(itemId);
    } else {
      onItemPress(itemId);
    }
  };
  return (
    <>
      {/* Render tables first (lower z-index) */}
      {furniture
        .filter((item) => item.type === 'TABLE')
        .map((item) => {
          const hitArea = getFurnitureHitArea(item.size, isMobile);
          const touchPadding = isMobile ? Math.max(0, (hitArea - item.size) / 2) : 0;

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.item,
                {
                  left: item.x * cellSize - touchPadding,
                  top: item.y * cellSize - touchPadding,
                  width: item.size + touchPadding * 2,
                  height: item.size + touchPadding * 2,
                  zIndex: 1,
                },
              ]}
            >
              <Pressable
                onPress={() => handlePress(item.id, 'TABLE')}
                style={[
                  styles.itemWrapper,
                  isMobile && styles.mobileItemWrapper,
                  {
                    padding: touchPadding,
                  },
                ]}
                android_ripple={{ color: 'rgba(139, 69, 19, 0.2)', borderless: false }}
              >
                <Square size={item.size} color="#8B4513" fill="#8B4513" strokeWidth={1} />
              </Pressable>
            </Animated.View>
          );
        })}

      {/* Render chairs after tables (higher z-index) */}
      {furniture
        .filter((item) => item.type === 'CHAIR')
        .map((item) => {
          const hitArea = getFurnitureHitArea(item.size, isMobile);
          const touchPadding = isMobile ? Math.max(0, (hitArea - item.size) / 2) : 0;

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.item,
                {
                  left: item.x * cellSize - touchPadding,
                  top: item.y * cellSize - touchPadding,
                  width: item.size + touchPadding * 2,
                  height: item.size + touchPadding * 2,
                  zIndex: 5, // Higher than tables
                },
              ]}
            >
              <Pressable
                onPress={() => handlePress(item.id, 'CHAIR')}
                style={[
                  styles.itemWrapper,
                  isMobile && styles.mobileItemWrapper,
                  {
                    overflow: 'visible',
                    padding: touchPadding,
                  },
                ]}
                android_ripple={{
                  color: item.personId
                    ? 'rgba(76, 175, 80, 0.3)'
                    : 'rgba(102, 102, 102, 0.3)',
                  borderless: false,
                }}
              >
                <View
                  style={[
                    styles.chair,
                    {
                      width: item.size,
                      height: item.size,
                      backgroundColor: item.personId ? '#4CAF50' : '#666',
                      borderColor: item.personId ? '#2E7D32' : '#444',
                      borderWidth: item.personId ? 2 : 1,
                      // Add a subtle shadow to make chairs stand out
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                      elevation: 3,
                    },
                    // Add mobile-specific styling
                    isMobile && styles.mobileChair,
                  ]}
                >
                  {item.personId && !item.personName && (
                    <View style={styles.assignedIndicator} />
                  )}
                  {item.personName && (
                    <ThemedText
                      style={[
                        styles.personName,
                        {
                          fontSize: isMobile
                            ? Math.max(item.size > 20 ? 14 : 12, 10)
                            : item.size > 20
                              ? 12
                              : 10,
                          textShadowColor: 'rgba(0,0,0,0.7)',
                          textShadowOffset: { width: 0, height: 1 },
                          textShadowRadius: 1,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {getInitialsFromFullName(item.personName)}
                    </ThemedText>
                  )}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileItemWrapper: {
    // Enhanced for mobile touch
    borderRadius: 8,
    overflow: 'hidden',
  },
  chair: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  mobileChair: {
    // Slightly enhanced border for mobile
    borderWidth: 2,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  assignedIndicator: {
    width: 6,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  personName: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});
