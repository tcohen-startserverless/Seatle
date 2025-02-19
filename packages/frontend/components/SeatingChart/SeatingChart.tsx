import { View, StyleSheet, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useRef, useState } from 'react';
import { Square, Trash2 } from 'lucide-react';

interface TablePosition {
  id: string;
  x: number;
  y: number;
  size: number;
  cells: number;
}

interface SeatingChartProps {
  cellSize?: number;
  minRows?: number;
  minColumns?: number;
  maxRows?: number;
  maxColumns?: number;
  edgePadding?: number;
  tables: TablePosition[];
  onTableUpdate?: (tables: TablePosition[]) => void;
}

export function SeatingChart({
  cellSize = 25,
  maxRows = 60,
  maxColumns = 60,
  edgePadding = 10,
  tables,
  onTableUpdate,
}: SeatingChartProps) {
  const borderColor = useThemeColor({}, 'border');
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const activeTableId = useSharedValue<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const viewportRef = useRef<View>(null);
  const contentRef = useRef<Animated.View>(null);
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });
  const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });

  const columns = maxColumns;
  const rows = maxRows;

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

  const handleTablePress = (tableId: string) => {
    setSelectedTableId(tableId === selectedTableId ? null : tableId);
  };

  const handleDeleteTable = (tableId: string) => {
    setSelectedTableId(null);
    onTableUpdate?.(tables.filter((t) => t.id !== tableId));
  };

  const measureViewport = () => {
    viewportRef.current?.measure((_, __, width, height) => {
      setViewportDimensions({ width, height });
    });
  };

  const measureContent = () => {
    contentRef.current?.measure((_, __, width, height) => {
      setContentDimensions({ width, height });
    });
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      setSelectedTableId(null);
      const x = (e.x - translateX.value) / (cellSize * scale.value);
      const y = (e.y - translateY.value) / (cellSize * scale.value);

      const hitTable = tables.find(
        (table) => Math.abs(table.x - x) < 1 && Math.abs(table.y - y) < 1
      );

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
        onTableUpdate?.(newTables);
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

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(
          <View
            key={`cell-${i}-${j}`}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                borderColor,
              },
            ]}
          />
        );
      }
      grid.push(
        <View key={`row-${i}`} style={styles.row}>
          {row}
        </View>
      );
    }

    return grid;
  };

  const renderTables = () => {
    return tables.map((table) => (
      <Animated.View
        key={table.id}
        style={[
          styles.table,
          {
            left: table.x * cellSize,
            top: table.y * cellSize,
            width: table.size,
            height: table.size,
          },
        ]}
      >
        <Pressable onPress={() => handleTablePress(table.id)} style={styles.tableWrapper}>
          <Square size={table.size} color="#8B4513" fill="#8B4513" strokeWidth={1} />
          {selectedTableId === table.id && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteTable(table.id)}
            >
              <Trash2 size={20} color="red" />
            </Pressable>
          )}
        </Pressable>
      </Animated.View>
    ));
  };

  return (
    <View style={styles.viewportContainer} ref={viewportRef} onLayout={measureViewport}>
      <GestureDetector gesture={composed}>
        <Animated.View
          ref={contentRef}
          onLayout={measureContent}
          style={[styles.container, animatedStyle]}
        >
          <View
            style={[
              styles.container,
              { width: cellSize * columns, padding: edgePadding },
            ]}
          >
            {renderGrid()}
            {renderTables()}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  container: {
    minWidth: 'auto',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
  },
  table: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -24,
    right: -24,
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
  },
});
