import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { FurniturePosition } from './types';

export function useSeatingChartGestures({
  furniture,
  onFurnitureUpdate,
  cellSize,
  maxRows,
  maxColumns,
  viewportDimensions,
  contentDimensions,
  edgePadding,
  onItemPress,
  setSelectedItemId,
}: {
  furniture: FurniturePosition[];
  onFurnitureUpdate: (furniture: FurniturePosition[]) => void;
  cellSize: number;
  maxRows: number;
  maxColumns: number;
  viewportDimensions: { width: number; height: number };
  contentDimensions: { width: number; height: number };
  edgePadding: number;
  onItemPress: (id: string) => void;
  setSelectedItemId: (id: string | null) => void;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const activeFurnitureId = useSharedValue<string | null>(null);

  const checkCollision = (item1: FurniturePosition, item2: FurniturePosition): boolean => {
    const rect1 = {
      left: item1.x,
      right: item1.x + (item1.size === 25 ? 1 : item1.size === 50 ? 2 : 3),
      top: item1.y,
      bottom: item1.y + (item1.size === 25 ? 1 : item1.size === 50 ? 2 : 3),
    };

    const rect2 = {
      left: item2.x,
      right: item2.x + (item2.size === 25 ? 1 : item2.size === 50 ? 2 : 3),
      top: item2.y,
      bottom: item2.y + (item2.size === 25 ? 1 : item2.size === 50 ? 2 : 3),
    };

    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    );
  };

  const hasCollision = (
    itemToCheck: FurniturePosition,
    allItems: FurniturePosition[],
    excludeId?: string
  ): boolean => {
    return allItems.some(
      (item) => item.id !== excludeId && checkCollision(itemToCheck, item)
    );
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .minDistance(5)
    .onStart((e) => {
      const x = (e.x - translateX.value) / (cellSize * scale.value);
      const y = (e.y - translateY.value) / (cellSize * scale.value);

      // First check chairs, then tables - prioritize chair selection
      const chairs = furniture.filter(item => item.type === 'CHAIR');
      const tables = furniture.filter(item => item.type === 'TABLE');
      
      // Check for chair hits first with a slightly more generous hit area
      const hitChair = chairs.find((chair) => {
        const chairSize = chair.size / cellSize;
        // Add a small buffer (0.2 cells) to make chair easier to grab
        return (
          x >= chair.x - 0.2 &&
          x <= chair.x + chairSize + 0.2 &&
          y >= chair.y - 0.2 &&
          y <= chair.y + chairSize + 0.2
        );
      });
      
      if (hitChair) {
        setSelectedItemId(null);
        activeFurnitureId.value = hitChair.id;
        return;
      }
      
      // Otherwise check tables with normal hit detection
      const hitTable = tables.find((table) => {
        const tableSize = table.size / cellSize;
        return (
          x >= table.x &&
          x <= table.x + tableSize &&
          y >= table.y &&
          y <= table.y + tableSize
        );
      });

      if (hitTable) {
        setSelectedItemId(null);
        activeFurnitureId.value = hitTable.id;
      }
    })
    .onUpdate((e) => {
      if (activeFurnitureId.value) {
        const newFurniture = furniture.map((item) => {
          if (item.id === activeFurnitureId.value) {
            const newX = Math.floor((e.x - translateX.value) / (cellSize * scale.value));
            const newY = Math.floor((e.y - translateY.value) / (cellSize * scale.value));
            const potentialPosition = {
              ...item,
              x: Math.max(0, Math.min(maxColumns - 1, newX)),
              y: Math.max(0, Math.min(maxRows - 1, newY)),
            };

            if (!hasCollision(potentialPosition, furniture, item.id)) {
              return potentialPosition;
            }
            return item;
          }
          return item;
        });
        onFurnitureUpdate(newFurniture);
      }
    })
    .onEnd(() => {
      if (activeFurnitureId.value) {
        activeFurnitureId.value = null;
      }
    });

  const composed = Gesture.Race(
    Gesture.Simultaneous(pinchGesture, panGesture),
    Gesture.Tap()
      .maxDistance(10)
      .onStart((e) => {
        const x = (e.x - translateX.value) / (cellSize * scale.value);
        const y = (e.y - translateY.value) / (cellSize * scale.value);

        // First check chairs, then tables - prioritize chair selection
        const chairs = furniture.filter(item => item.type === 'CHAIR');
        const tables = furniture.filter(item => item.type === 'TABLE');
        
        // Check for chair hits first with a slightly more generous hit area
        const hitChair = chairs.find((chair) => {
          const chairSize = chair.size / cellSize;
          // Add a small buffer to make chair easier to tap
          return (
            x >= chair.x - 0.2 &&
            x <= chair.x + chairSize + 0.2 &&
            y >= chair.y - 0.2 &&
            y <= chair.y + chairSize + 0.2
          );
        });
        
        // If we hit a chair, use it
        if (hitChair) {
          onItemPress(hitChair.id);
          return;
        }
        
        // Otherwise check tables with normal hit detection
        const hitTable = tables.find((table) => {
          const tableSize = table.size / cellSize;
          return (
            x >= table.x &&
            x <= table.x + tableSize &&
            y >= table.y &&
            y <= table.y + tableSize
          );
        });

        if (hitTable) {
          onItemPress(hitTable.id);
        } else {
          setSelectedItemId(null);
        }
      })
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return {
    scale,
    translateX,
    translateY,
    gesture: composed,
    animatedStyle,
  };
}
