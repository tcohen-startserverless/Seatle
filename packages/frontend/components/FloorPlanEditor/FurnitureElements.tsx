import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Square, Trash2, Circle } from 'lucide-react';
import { FurnitureElementsProps, FurniturePosition } from './types';
import { ThemedText } from '@/components/ThemedText';

export function FurnitureElements({
  furniture,
  selectedItemId,
  cellSize,
  onItemPress,
  onDeleteItem,
  onChairAssign,
}: FurnitureElementsProps) {
  return (
    <>
      {/* Render tables first (lower z-index) */}
      {furniture
        .filter(item => item.type === 'TABLE')
        .map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.item,
              {
                left: item.x * cellSize,
                top: item.y * cellSize,
                width: item.size,
                height: item.size,
                zIndex: 1,
              },
            ]}
          >
            <Pressable onPress={() => onItemPress(item.id)} style={styles.itemWrapper}>
              <Square size={item.size} color="#8B4513" fill="#8B4513" strokeWidth={1} />
            </Pressable>
            {selectedItemId === item.id && (
              <Pressable
                style={styles.deleteButton}
                onPressIn={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id, e);
                }}
                hitSlop={15}
              >
                <View style={styles.deleteButtonInner}>
                  <Trash2 size={20} color="red" />
                </View>
              </Pressable>
            )}
          </Animated.View>
        ))}
        
      {/* Render chairs after tables (higher z-index) */}
      {furniture
        .filter(item => item.type === 'CHAIR')
        .map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.item,
              {
                left: item.x * cellSize,
                top: item.y * cellSize,
                width: item.size,
                height: item.size,
                zIndex: 5, // Higher than tables
              },
            ]}
          >
            <Pressable 
              onPress={() => {
                // If we have an assignment handler, call it for chair assignment
                if (onChairAssign) {
                  onChairAssign(item.id);
                } else {
                  // Otherwise use regular item press handler
                  onItemPress(item.id);
                }
              }} 
              style={[styles.itemWrapper, { overflow: 'visible' }]}
            >
              <View
                style={[
                  styles.chair,
                  {
                    width: item.size,
                    height: item.size,
                    backgroundColor: item.personId ? '#4CAF50' : '#666',
                    // Add a subtle shadow to make chairs stand out
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 3,
                  },
                ]}
              >
                {item.personName && (
                  <ThemedText style={styles.personName} numberOfLines={1}>
                    {item.personName}
                  </ThemedText>
                )}
              </View>
            </Pressable>
            {selectedItemId === item.id && (
              <Pressable
                style={styles.deleteButton}
                onPressIn={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id, e);
                }}
                hitSlop={15}
              >
                <View style={styles.deleteButtonInner}>
                  <Trash2 size={20} color="red" />
                </View>
              </Pressable>
            )}
          </Animated.View>
        ))}
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
  chair: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  personName: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -30,
    right: -30,
    zIndex: 100,
    elevation: 6,
  },
  deleteButtonInner: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 101,
  },
});