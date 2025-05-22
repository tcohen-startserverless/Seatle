import { View, StyleSheet, GestureResponderEvent, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useRef, useState } from 'react';
import { useSeatingChartGestures } from './TableLayoutGestures';
import { Grid } from './GridBackground';
import { FurnitureElements } from './FurnitureElements';
import { SeatingChartProps } from './types';

export function FloorPlanEditor({
  cellSize = 25,
  maxRows = 60,
  maxColumns = 60,
  edgePadding = 10,
  furniture,
  onFurnitureUpdate,
  onChairAssign,
  onFurnitureSelect,
}: SeatingChartProps) {
  const borderColor = useThemeColor({}, 'border');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
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
    furniture,
    onFurnitureUpdate,
    cellSize,
    maxRows,
    maxColumns,
    viewportDimensions,
    contentDimensions,
    edgePadding,
    onItemPress: (id) => setSelectedItemId(id),
    setSelectedItemId,
  });

  const handleItemPress = (itemId: string) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId);
  };

  // Delete functionality moved to side panel

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
      <ScrollView 
        horizontal
        contentContainerStyle={{ flexGrow: 1 }}
        showsHorizontalScrollIndicator={false} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        bouncesZoom={true}
        scrollEventThrottle={16}
      >
        <ScrollView
          contentContainerStyle={{ 
            width: cellSize * maxColumns + (edgePadding * 2),
            minHeight: cellSize * maxRows + (edgePadding * 2) 
          }}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
        >
          <GestureDetector gesture={composed}>
            <Animated.View
              ref={contentRef}
              onLayout={measureContent}
              style={[styles.container, animatedStyle]}
            >
              <View
                style={[
                  styles.container,
                  { 
                    width: cellSize * maxColumns,
                    minHeight: cellSize * maxRows,
                    padding: edgePadding
                  },
                ]}
              >
                <Grid
                  rows={maxRows}
                  columns={maxColumns}
                  cellSize={cellSize}
                  borderColor={borderColor}
                />
                <FurnitureElements
                  furniture={furniture}
                  selectedItemId={selectedItemId}
                  cellSize={cellSize}
                  onItemPress={handleItemPress}
                  onChairAssign={onChairAssign}
                  onFurnitureSelect={onFurnitureSelect}
                />
              </View>
            </Animated.View>
          </GestureDetector>
        </ScrollView>
      </ScrollView>
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
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
  },
});
