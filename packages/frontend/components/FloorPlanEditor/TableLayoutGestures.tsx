import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { TablePosition } from './types';

export function useSeatingChartGestures({
  tables,
  onTableUpdate,
  cellSize,
  maxRows,
  maxColumns,
  viewportDimensions,
  contentDimensions,
  edgePadding,
  onTablePress,
  setSelectedTableId,
}: {
  tables: TablePosition[];
  onTableUpdate: (tables: TablePosition[]) => void;
  cellSize: number;
  maxRows: number;
  maxColumns: number;
  viewportDimensions: { width: number; height: number };
  contentDimensions: { width: number; height: number };
  edgePadding: number;
  onTablePress: (id: string) => void;
  setSelectedTableId: (id: string | null) => void;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const activeTableId = useSharedValue<string | null>(null);

  const checkCollision = (table1: TablePosition, table2: TablePosition): boolean => {
    const rect1 = {
      left: table1.x,
      right: table1.x + (table1.size === 25 ? 1 : table1.size === 50 ? 2 : 3),
      top: table1.y,
      bottom: table1.y + (table1.size === 25 ? 1 : table1.size === 50 ? 2 : 3),
    };

    const rect2 = {
      left: table2.x,
      right: table2.x + (table2.size === 25 ? 1 : table2.size === 50 ? 2 : 3),
      top: table2.y,
      bottom: table2.y + (table2.size === 25 ? 1 : table2.size === 50 ? 2 : 3),
    };

    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    );
  };

  const hasCollision = (
    tableToCheck: TablePosition,
    allTables: TablePosition[],
    excludeId?: string
  ): boolean => {
    return allTables.some(
      (table) => table.id !== excludeId && checkCollision(tableToCheck, table)
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
      setSelectedTableId(null);
      const x = (e.x - translateX.value) / (cellSize * scale.value);
      const y = (e.y - translateY.value) / (cellSize * scale.value);

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
        activeTableId.value = hitTable.id;
      }
    })
    .onUpdate((e) => {
      if (activeTableId.value) {
        const newTables = tables.map((table) => {
          if (table.id === activeTableId.value) {
            const newX = Math.floor((e.x - translateX.value) / (cellSize * scale.value));
            const newY = Math.floor((e.y - translateY.value) / (cellSize * scale.value));
            const potentialPosition = {
              ...table,
              x: Math.max(0, Math.min(maxColumns - 1, newX)),
              y: Math.max(0, Math.min(maxRows - 1, newY)),
            };

            if (!hasCollision(potentialPosition, tables, table.id)) {
              return potentialPosition;
            }
            return table;
          }
          return table;
        });
        onTableUpdate(newTables);
      } else {
        const scaledContentWidth =
          (contentDimensions.width + edgePadding * 2) * scale.value;
        const scaledContentHeight =
          (contentDimensions.height + edgePadding * 2) * scale.value;

        const minX = -(scaledContentWidth - viewportDimensions.width);
        const maxX = edgePadding;
        const minY = -(scaledContentHeight - viewportDimensions.height);
        const maxY = edgePadding;

        translateX.value = Math.min(
          maxX,
          Math.max(minX, savedTranslateX.value + e.translationX)
        );
        translateY.value = Math.min(
          maxY,
          Math.max(minY, savedTranslateY.value + e.translationY)
        );
      }
    })
    .onEnd(() => {
      if (activeTableId.value) {
        activeTableId.value = null;
      } else {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const composed = Gesture.Race(
    Gesture.Simultaneous(pinchGesture, panGesture),
    Gesture.Tap()
      .maxDistance(10)
      .onStart((e) => {
        const x = (e.x - translateX.value) / (cellSize * scale.value);
        const y = (e.y - translateY.value) / (cellSize * scale.value);

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
          onTablePress(hitTable.id);
        } else {
          setSelectedTableId(null);
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
