import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useRef, useState } from 'react';
import { useSeatingChartGestures } from './TableLayoutGestures';
import { Grid } from './GridBackground';
import { Tables } from './TableElements';
import { SeatingChartProps } from './types';

export function FloorPlanEditor({
  cellSize = 25,
  maxRows = 60,
  maxColumns = 60,
  edgePadding = 10,
  tables,
  onTableUpdate,
}: SeatingChartProps) {
  const borderColor = useThemeColor({}, 'border');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const viewportRef = useRef<View>(null);
  const contentRef = useRef<Animated.View>(null);
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });
  const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });

  const {
    gesture: composed,
    scale,
    translateX,
    translateY,
  } = useSeatingChartGestures({
    tables,
    onTableUpdate,
    cellSize,
    maxRows,
    maxColumns,
    viewportDimensions,
    contentDimensions,
    edgePadding,
    onTablePress: (id) => setSelectedTableId(id),
    setSelectedTableId,
  });

  const handleTablePress = (tableId: string) => {
    setSelectedTableId(tableId === selectedTableId ? null : tableId);
  };

  const handleDeleteTable = (tableId: string, e: GestureResponderEvent) => {
    e.stopPropagation();
    setSelectedTableId(null);
    const updatedTables = tables.filter((t) => t.id !== tableId);
    onTableUpdate?.(updatedTables);
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

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
              { width: cellSize * maxColumns, padding: edgePadding },
            ]}
          >
            <Grid
              rows={maxRows}
              columns={maxColumns}
              cellSize={cellSize}
              borderColor={borderColor}
            />
            <Tables
              tables={tables}
              selectedTableId={selectedTableId}
              cellSize={cellSize}
              onTablePress={handleTablePress}
              onDeleteTable={handleDeleteTable}
            />
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
    top: -16,
    right: -16,
    zIndex: 100,
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
  },
});
