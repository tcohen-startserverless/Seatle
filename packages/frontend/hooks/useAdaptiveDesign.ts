import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// UX-driven breakpoint definitions
export const DesignBreakpoints = {
  mobile: { max: 767, paradigm: 'touch-first' as const },
  tablet: { min: 768, max: 1023, paradigm: 'hybrid' as const },
  desktop: { min: 1024, paradigm: 'precision' as const },
};

// Content width constraints for optimal reading
const CONTENT_CONSTRAINTS = {
  mobile: { min: 280, max: 480 },
  tablet: { min: 480, max: 768 },
  desktop: { min: 768, max: 1200 },
};

// Touch target sizing based on platform guidelines
const TOUCH_TARGETS = {
  mobile: { min: 44, comfortable: 48, spacious: 56 },
  tablet: { min: 44, comfortable: 48, spacious: 56 },
  desktop: { min: 32, comfortable: 40, spacious: 48 },
};

export interface AdaptiveDesignConfig {
  // Core breakpoint detection
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Interaction paradigm
  touchFirst: boolean;
  hybrid: boolean;
  precision: boolean;

  // Layout properties
  density: 'compact' | 'comfortable' | 'spacious';
  orientation: 'portrait' | 'landscape';

  // Dimensions
  screenWidth: number;
  screenHeight: number;
  availableWidth: number;
  availableHeight: number;
  contentWidth: number;

  // Navigation patterns
  navigationStyle: 'bottom-tabs' | 'sidebar' | 'top-tabs';
  modalStyle: 'fullscreen' | 'centered' | 'bottom-sheet';

  // Content presentation
  contentColumns: number;
  gridColumns: (minItemWidth: number, maxColumns?: number) => number;

  // Touch targets
  touchTargets: typeof TOUCH_TARGETS.mobile;

  // Platform specific
  isWeb: boolean;
  isNative: boolean;
  supportsHover: boolean;

  // Accessibility
  prefersReducedMotion: boolean;
  highContrastEnabled: boolean;

  // Icon sizing utilities
  getIconSize: (
    context?: 'small' | 'medium' | 'large' | 'tab' | 'card' | 'action'
  ) => number;
}

export const useAdaptiveDesign = (): AdaptiveDesignConfig => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Platform detection
  const isWeb = Platform.OS === 'web';
  const isNative = !isWeb;

  // Breakpoint detection
  const isMobile = width <= DesignBreakpoints.mobile.max;
  const isTablet =
    width >= DesignBreakpoints.tablet.min && width <= DesignBreakpoints.tablet.max;
  const isDesktop = width >= DesignBreakpoints.desktop.min;

  // Interaction paradigm
  const touchFirst = isMobile;
  const hybrid = isTablet;
  const precision = isDesktop;

  // Orientation
  const orientation = width > height ? 'landscape' : 'portrait';

  // Available space calculations
  const availableWidth = width - insets.left - insets.right;
  const availableHeight = height - insets.top - insets.bottom;

  // Content width constraints (UX optimization)
  const getContentWidth = () => {
    // Always ensure we stay within available space with proper padding
    const padding = isMobile ? 32 : isTablet ? 48 : 64;
    const maxPossibleWidth = availableWidth - padding;

    if (isMobile) {
      return Math.max(
        CONTENT_CONSTRAINTS.mobile.min,
        Math.min(maxPossibleWidth, CONTENT_CONSTRAINTS.mobile.max)
      );
    } else if (isTablet) {
      return Math.max(
        CONTENT_CONSTRAINTS.tablet.min,
        Math.min(maxPossibleWidth, CONTENT_CONSTRAINTS.tablet.max)
      );
    } else {
      // For desktop, prioritize available space over max constraint when window is small
      const maxWidth = Math.min(maxPossibleWidth, CONTENT_CONSTRAINTS.desktop.max);
      return Math.max(CONTENT_CONSTRAINTS.desktop.min, maxWidth);
    }
  };

  // Layout density (follows platform conventions)
  const getDensity = (): 'compact' | 'comfortable' | 'spacious' => {
    if (isMobile) return 'comfortable';
    if (isTablet) return orientation === 'landscape' ? 'comfortable' : 'spacious';
    return 'compact';
  };

  // Navigation pattern selection
  const getNavigationStyle = (): 'bottom-tabs' | 'sidebar' | 'top-tabs' => {
    if (isMobile) return 'bottom-tabs';
    if (isTablet) return orientation === 'landscape' ? 'sidebar' : 'bottom-tabs';
    return 'sidebar';
  };

  // Modal presentation style
  const getModalStyle = (): 'fullscreen' | 'centered' | 'bottom-sheet' => {
    if (isMobile) return 'bottom-sheet';
    if (isTablet) return orientation === 'portrait' ? 'bottom-sheet' : 'centered';
    return 'centered';
  };

  // Content columns (for multi-column layouts)
  const getContentColumns = (): number => {
    if (isMobile) return 1;
    if (isTablet) return orientation === 'landscape' ? 2 : 1;
    return availableWidth > 1000 ? 2 : 1;
  };

  // Grid columns calculator (Miller's Law - max 7 items)
  const getGridColumns = (minItemWidth: number, maxColumns = 7): number => {
    const availableSpace = availableWidth - 32; // Account for padding
    const maxPossibleColumns = Math.floor(availableSpace / minItemWidth);
    return Math.min(Math.max(1, maxPossibleColumns), maxColumns);
  };

  // Touch target sizing
  const getTouchTargets = () => {
    if (isMobile) return TOUCH_TARGETS.mobile;
    if (isTablet) return TOUCH_TARGETS.tablet;
    return TOUCH_TARGETS.desktop;
  };

  // Accessibility preferences (would need platform-specific implementation)
  const prefersReducedMotion = false; // Platform.OS === 'ios' ? AccessibilityInfo.isReduceMotionEnabled : false;
  const highContrastEnabled = false; // Platform-specific implementation needed

  // Icon sizing utility - follows UX principles for optimal touch targets and visual hierarchy
  const getIconSize = (
    context: 'small' | 'medium' | 'large' | 'tab' | 'card' | 'action' = 'medium'
  ): number => {
    const sizes = {
      mobile: {
        small: 16,
        medium: 20,
        large: 24,
        tab: 24,
        card: 26,
        action: 28,
      },
      tablet: {
        small: 16,
        medium: 20,
        large: 24,
        tab: 22,
        card: 24,
        action: 26,
      },
      desktop: {
        small: 14,
        medium: 16,
        large: 20,
        tab: 20,
        card: 20,
        action: 22,
      },
    };

    if (isMobile) return sizes.mobile[context];
    if (isTablet) return sizes.tablet[context];
    return sizes.desktop[context];
  };

  return {
    // Core breakpoints
    isMobile,
    isTablet,
    isDesktop,

    // Interaction paradigms
    touchFirst,
    hybrid,
    precision,

    // Layout properties
    density: getDensity(),
    orientation,

    // Dimensions
    screenWidth: width,
    screenHeight: height,
    availableWidth,
    availableHeight,
    contentWidth: getContentWidth(),

    // Navigation patterns
    navigationStyle: getNavigationStyle(),
    modalStyle: getModalStyle(),

    // Content presentation
    contentColumns: getContentColumns(),
    gridColumns: getGridColumns,

    // Touch targets
    touchTargets: getTouchTargets(),

    // Platform specific
    isWeb,
    isNative,
    supportsHover: isWeb && !isMobile,

    // Accessibility
    prefersReducedMotion,
    highContrastEnabled,

    // Icon sizing
    getIconSize,
  };
};

// Utility hooks for specific use cases
export const useIsMobile = () => useAdaptiveDesign().isMobile;
export const useIsTablet = () => useAdaptiveDesign().isTablet;
export const useIsDesktop = () => useAdaptiveDesign().isDesktop;
export const useTouchFirst = () => useAdaptiveDesign().touchFirst;
export const useModalStyle = () => useAdaptiveDesign().modalStyle;
export const useNavigationStyle = () => useAdaptiveDesign().navigationStyle;
