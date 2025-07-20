import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import {
  useResponsiveInfo,
  getChartLayoutConfig,
  type ResponsiveInfo,
} from '@/utils/responsive';
import { BottomSheet, BottomSheetState } from './BottomSheet';
import { FloatingActionButton } from './FloatingActionButton';

export interface MobileChartLayoutProps {
  children: React.ReactNode;
  toolbarContent?: React.ReactNode;
  floatingActionIcon?: React.ReactNode;
  onFloatingActionPress?: () => void;
  showFloatingAction?: boolean;
  enableGestures?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  responsiveInfo: ResponsiveInfo;
  layoutConfig: ReturnType<typeof getChartLayoutConfig>;
}

export function MobileChartLayout({
  children,
  toolbarContent,
  floatingActionIcon,
  onFloatingActionPress,
  showFloatingAction = true,
  enableGestures = true,
  style,
  contentStyle,
  responsiveInfo,
  layoutConfig,
}: MobileChartLayoutProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const [toolbarState, setToolbarState] = useState<BottomSheetState>('collapsed');

  const handleFloatingActionPress = useCallback(() => {
    console.log('MobileChartLayout: FAB pressed', {
      toolbarState,
      showFloatingAction,
      hasToolbarContent: !!toolbarContent,
      peekHeight: SCREEN_HEIGHT * 0.25,
      expandedHeight: SCREEN_HEIGHT * 0.5,
    });

    if (onFloatingActionPress) {
      onFloatingActionPress();
    }

    // Toggle toolbar state
    if (toolbarState === 'collapsed') {
      console.log('Setting toolbar to peek');
      setToolbarState('peek');
    } else if (toolbarState === 'peek') {
      console.log('Setting toolbar to expanded');
      setToolbarState('expanded');
    } else {
      console.log('Setting toolbar to collapsed');
      setToolbarState('collapsed');
    }
  }, [
    toolbarState,
    onFloatingActionPress,
    showFloatingAction,
    toolbarContent,
    SCREEN_HEIGHT,
  ]);

  const handleToolbarStateChange = useCallback(
    (newState: BottomSheetState) => {
      console.log('Toolbar state changed:', { from: toolbarState, to: newState });
      setToolbarState(newState);
    },
    [toolbarState]
  );

  // Desktop layout - show fixed sidebar
  if (layoutConfig.showFixedSidebar) {
    return (
      <View style={[styles.desktopContainer, style]}>
        <View style={[styles.desktopContent, contentStyle]}>{children}</View>
      </View>
    );
  }

  // Mobile layout - use bottom sheet
  console.log('Rendering mobile layout', {
    showFloatingAction,
    hasFloatingActionIcon: !!floatingActionIcon,
    hasToolbarContent: !!toolbarContent,
    toolbarState,
    layoutMode: layoutConfig.layoutMode,
  });

  return (
    <View style={[styles.mobileContainer, style]}>
      {/* Main content area */}
      <View
        style={[
          styles.mobileContent,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>

      {/* Floating Action Button */}
      {showFloatingAction && floatingActionIcon && (
        <FloatingActionButton
          onPress={handleFloatingActionPress}
          icon={floatingActionIcon}
          visible={toolbarState === 'collapsed'}
        />
      )}

      {/* Bottom Sheet Toolbar */}
      {toolbarContent && (
        <BottomSheet
          state={toolbarState}
          onStateChange={handleToolbarStateChange}
          peekHeight={SCREEN_HEIGHT * 0.25}
          expandedHeight={SCREEN_HEIGHT * 0.5}
          enableGestures={enableGestures}
          style={styles.bottomSheet}
          contentStyle={styles.bottomSheetContent}
        >
          {toolbarContent}
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Desktop styles
  desktopContainer: {
    flex: 1,
  },
  desktopContent: {
    flex: 1,
  },

  // Mobile styles
  mobileContainer: {
    flex: 1,
    position: 'relative',
  },
  mobileContent: {
    flex: 1,
  },
  bottomSheet: {
    // Additional bottom sheet styling if needed
  },
  bottomSheetContent: {
    paddingTop: 8,
  },
});
