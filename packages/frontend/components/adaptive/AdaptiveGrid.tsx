import React, { useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  ListRenderItemInfo,
  Platform,
} from 'react-native';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useSpacing } from '@/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// Calculate columns purely based on available space
const calculateColumnsFromSpace = (
  availableWidth: number,
  minItemWidth: number,
  itemSpacing: number,
  contentPadding: number,
  maxColumns: number = 20
): number => {
  const usableWidth = availableWidth - contentPadding * 2;

  // Correct formula: N items + (N-1) spacing gaps
  // N * itemWidth + (N-1) * spacing <= usableWidth
  // N * (itemWidth + spacing) - spacing <= usableWidth
  // N <= (usableWidth + spacing) / (itemWidth + spacing)
  const calculatedColumns = Math.floor(
    (usableWidth + itemSpacing) / (minItemWidth + itemSpacing)
  );

  // Apply reasonable upper limit to prevent UI issues, but allow many columns
  return Math.min(Math.max(1, calculatedColumns), maxColumns);
};

// Calculate minimum item width dynamically based on content needs
const calculateMinItemWidth = (
  availableWidth: number,
  isMobile: boolean,
  isTablet: boolean
): number => {
  // Base minimum width to ensure content is readable
  const baseMinWidth = 120;

  // Scale based on available space - larger screens can have smaller relative items
  if (isMobile) {
    return Math.max(baseMinWidth, Math.min(280, availableWidth * 0.8));
  } else if (isTablet) {
    return Math.max(baseMinWidth, Math.min(200, availableWidth * 0.25));
  } else {
    // Desktop: aim for reasonable button size that fits content
    return Math.max(baseMinWidth, Math.min(180, availableWidth * 0.15));
  }
};

// Remove hardcoded max widths - let space calculation handle sizing

export interface AdaptiveGridProps<T> {
  data: T[];
  renderItem: (info: ListRenderItemInfo<T> & { isGrid: boolean }) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;

  // Grid configuration
  minItemWidth?: number;
  maxColumns?: number;
  aspectRatio?: number;

  // Layout preferences
  forceGrid?: boolean;
  forceFlatList?: boolean;

  // Spacing
  spacing?: number;
  contentPadding?: number;
  availableWidth?: number;

  // FlatList props
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshing?: boolean;
  onRefresh?: () => void;

  // Performance
  removeClippedSubviews?: boolean;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;

  // Accessibility
  accessibilityLabel?: string;

  // Styling
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;

  // Empty state
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement;

  // Header/Footer
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement;
}

export function AdaptiveGrid<T>({
  data,
  renderItem,
  keyExtractor,
  minItemWidth,
  maxColumns = 8,
  aspectRatio,
  forceGrid = false,
  forceFlatList = false,
  spacing,
  contentPadding = 16,
  availableWidth: propAvailableWidth,
  onEndReached,
  onEndReachedThreshold = 0.5,
  refreshing = false,
  onRefresh,
  removeClippedSubviews = true,
  maxToRenderPerBatch = 10,
  updateCellsBatchingPeriod = 50,
  accessibilityLabel,
  style,
  contentContainerStyle,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
}: AdaptiveGridProps<T>) {
  const {
    isMobile,
    isTablet,
    isDesktop,
    availableWidth: hookAvailableWidth,
    gridColumns,
    density,
    touchFirst,
    navigationStyle,
    screenWidth,
  } = useAdaptiveDesign();
  const tabBarHeight = useBottomTabBarHeight();

  // Use prop availableWidth if provided, otherwise use hook value
  const availableWidth = propAvailableWidth ?? hookAvailableWidth;
  const spacingTheme = useSpacing();

  // Calculate optimal spacing based on density - reduced for better space utilization
  const itemSpacing = useMemo(() => {
    if (spacing !== undefined) return spacing;

    switch (density) {
      case 'compact':
        return spacingTheme.xs;
      case 'comfortable':
        return spacingTheme.sm;
      case 'spacious':
        return spacingTheme.md;
      default:
        return spacingTheme.sm;
    }
  }, [spacing, density, spacingTheme]);

  // Get responsive min item width based on actual available space
  const responsiveMinItemWidth = useMemo(() => {
    if (minItemWidth !== undefined) return minItemWidth;

    return calculateMinItemWidth(availableWidth, isMobile, isTablet);
  }, [minItemWidth, availableWidth, isMobile, isTablet]);

  // Calculate number of columns based purely on available space
  const numColumns = useMemo(() => {
    if (forceFlatList) return 1;

    // Pure space-based calculation - no hardcoded breakpoints
    const calculatedColumns = calculateColumnsFromSpace(
      availableWidth,
      responsiveMinItemWidth,
      itemSpacing,
      contentPadding,
      maxColumns
    );

    // Only force grid behavior if explicitly requested
    if (forceGrid) return calculatedColumns;

    // Use grid layout if we can fit more than 1 column and we're not on mobile
    return !isMobile && calculatedColumns > 1 ? calculatedColumns : 1;
  }, [
    forceFlatList,
    forceGrid,
    isMobile,
    maxColumns,
    responsiveMinItemWidth,
    availableWidth,
    contentPadding,
    itemSpacing,
  ]);

  // Determine if we should use grid layout
  const shouldUseGrid = useMemo(() => {
    if (forceFlatList) return false;
    if (forceGrid) return true;

    // Use grid on tablet/desktop with multiple columns
    return (isTablet || isDesktop) && numColumns > 1;
  }, [forceFlatList, forceGrid, isTablet, isDesktop, numColumns]);

  // Calculate item dimensions based purely on available space
  const itemDimensions = useMemo(() => {
    if (!shouldUseGrid) return null;

    // Calculate exact available width per item
    const availableSpace = availableWidth - contentPadding * 2;
    const totalSpacing = itemSpacing * (numColumns - 1);
    const itemWidth = (availableSpace - totalSpacing) / numColumns;

    // Simple aspect ratio - shorter on desktop for better density
    const defaultAspectRatio = isMobile ? 0.6 : 0.4;
    const itemHeight = itemWidth * (aspectRatio || defaultAspectRatio);

    return { width: itemWidth, height: itemHeight };
  }, [
    shouldUseGrid,
    availableWidth,
    contentPadding,
    itemSpacing,
    numColumns,
    aspectRatio,
    isMobile,
  ]);

  // Default key extractor
  const defaultKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) return keyExtractor(item, index);
      return `item-${index}`;
    },
    [keyExtractor]
  );

  // Enhanced render item with grid context
  const enhancedRenderItem = useCallback(
    (info: ListRenderItemInfo<T>) => {
      const itemStyle: ViewStyle = {};

      if (shouldUseGrid && itemDimensions) {
        itemStyle.width = itemDimensions.width;
        itemStyle.height = itemDimensions.height;

        // Consistent spacing - margin right except last in row, margin bottom except last row
        const isLastInRow = (info.index + 1) % numColumns === 0;
        const totalRows = Math.ceil(data.length / numColumns);
        const currentRow = Math.floor(info.index / numColumns) + 1;
        const isLastRow = currentRow === totalRows;

        itemStyle.marginRight = isLastInRow ? 0 : itemSpacing;
        itemStyle.marginBottom = isLastRow ? 0 : itemSpacing;
      } else {
        // Single column layout - no margin on last item
        const isLastItem = info.index === data.length - 1;
        itemStyle.marginBottom = isLastItem ? 0 : itemSpacing;
      }

      return (
        <View style={itemStyle}>{renderItem({ ...info, isGrid: shouldUseGrid })}</View>
      );
    },
    [shouldUseGrid, itemDimensions, itemSpacing, numColumns, renderItem, data.length]
  );

  // Grid-specific styles
  const gridStyles = useMemo(() => {
    if (!shouldUseGrid) return {};

    return {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'flex-start' as const,
      alignItems: 'flex-start' as const,
    };
  }, [shouldUseGrid]);

  // Content container style
  const combinedContentContainerStyle = useMemo(() => {
    let bottomPadding = contentPadding;

    if (touchFirst) {
      // Add space for FAB
      bottomPadding += 80;

      // Treat medium screens like mobile - add tab bar height
      if (
        navigationStyle === 'bottom-tabs' ||
        isTablet ||
        (screenWidth >= 768 && screenWidth <= 1200)
      ) {
        bottomPadding += tabBarHeight; // Actual tab bar height
      }
    }

    return [
      {
        padding: contentPadding,
        paddingBottom: bottomPadding,
      },
      gridStyles,
      contentContainerStyle,
    ];
  }, [contentPadding, touchFirst, navigationStyle, gridStyles, contentContainerStyle]);

  // FlatList configuration for performance
  const flatListConfig = useMemo(
    () => ({
      removeClippedSubviews: removeClippedSubviews && Platform.OS !== 'web',
      maxToRenderPerBatch,
      updateCellsBatchingPeriod,
      windowSize: touchFirst ? 10 : 21, // Smaller window on mobile for better performance
      initialNumToRender: touchFirst ? 10 : 20,
      getItemLayout:
        shouldUseGrid && itemDimensions
          ? (_: any, index: number) => ({
              length: itemDimensions.height + itemSpacing,
              offset:
                (itemDimensions.height + itemSpacing) * Math.floor(index / numColumns),
              index,
            })
          : undefined,
    }),
    [
      removeClippedSubviews,
      maxToRenderPerBatch,
      updateCellsBatchingPeriod,
      touchFirst,
      shouldUseGrid,
      itemDimensions,
      itemSpacing,
      numColumns,
    ]
  );

  return (
    <FlatList
      data={data}
      renderItem={enhancedRenderItem}
      keyExtractor={defaultKeyExtractor}
      numColumns={shouldUseGrid ? numColumns : 1}
      key={`flatlist-${numColumns}-${availableWidth}-${shouldUseGrid}`} // Force re-render when columns or window size change
      // Layout
      contentContainerStyle={combinedContentContainerStyle}
      style={[styles.container, style]}
      // Interaction
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshing={refreshing}
      onRefresh={onRefresh}
      // Performance
      {...flatListConfig}
      // Accessibility
      accessibilityLabel={accessibilityLabel}
      // Components
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      // Behavior
      showsVerticalScrollIndicator={!touchFirst}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      // Platform specific optimizations
      {...(Platform.OS === 'ios' && {
        automaticallyAdjustContentInsets: false,
        scrollIndicatorInsets: { right: 1 },
      })}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
