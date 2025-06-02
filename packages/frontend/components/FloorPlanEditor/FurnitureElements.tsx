import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Square, Circle } from 'lucide-react';
import { FurnitureElementsProps } from './types';
import { ThemedText } from '@/components/ThemedText';
import { getInitialsFromFullName } from '@/utils/nameHelpers';

export function FurnitureElements({
  furniture,
  selectedItemId,
  cellSize,
  onItemPress,
  onChairAssign,
  onFurnitureSelect,
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
            <Pressable 
              onPress={() => {
                if (onFurnitureSelect) {
                  onFurnitureSelect(item.id);
                } else {
                  onItemPress(item.id);
                }
              }} 
              style={styles.itemWrapper}>
              <Square size={item.size} color="#8B4513" fill="#8B4513" strokeWidth={1} />
            </Pressable>
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
                if (onFurnitureSelect) {
                  onFurnitureSelect(item.id);
                }
                else if (onChairAssign) {
                  onChairAssign(item.id);
                } else {

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
                    borderColor: item.personId ? '#2E7D32' : '#444',
                    borderWidth: item.personId ? 2 : 1,
                    // Add a subtle shadow to make chairs stand out
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 3,
                  },
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
                        fontSize: item.size > 20 ? 12 : 10,
                        textShadowColor: 'rgba(0,0,0,0.7)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 1,
                      }
                    ]} 
                    numberOfLines={1}
                  >
                    {getInitialsFromFullName(item.personName)}
                  </ThemedText>
                )}
              </View>
            </Pressable>
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