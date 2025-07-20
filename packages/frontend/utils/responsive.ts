import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

export const MOBILE_BREAKPOINTS = {
  phone: { maxWidth: 768 },
  tablet: { minWidth: 768, maxWidth: 1024 },
  desktop: { minWidth: 1024 },
} as const;

export const MOBILE_SPECS = {
  // Toolbar
  toolbarCollapsedHeight: 0,
  toolbarPeekHeight: '25%',
  toolbarExpandedHeight: '50%',

  // Touch Targets
  minimumTouchTarget: 44,
  touchPadding: 20,

  // Furniture
  furnitureMinSize: 30,
  furnitureHitArea: 50,

  // Animations
  transitionDuration: 300,
  springConfig: { tension: 300, friction: 30 },
} as const;

export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export interface ResponsiveInfo {
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  screenType: 'phone' | 'tablet' | 'desktop';
  dimensions: ScreenDimensions;
  orientation: 'portrait' | 'landscape';
}

export function getScreenType(width: number): 'phone' | 'tablet' | 'desktop' {
  if (width <= MOBILE_BREAKPOINTS.phone.maxWidth) {
    return 'phone';
  } else if (width <= MOBILE_BREAKPOINTS.tablet.maxWidth) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

export function getResponsiveInfo(dimensions: ScreenDimensions): ResponsiveInfo {
  const { width, height } = dimensions;
  const screenType = getScreenType(width);

  return {
    isPhone: screenType === 'phone',
    isTablet: screenType === 'tablet',
    isDesktop: screenType === 'desktop',
    isMobile: screenType === 'phone' || screenType === 'tablet',
    screenType,
    dimensions,
    orientation: height > width ? 'portrait' : 'landscape',
  };
}

export function useScreenDimensions(): ScreenDimensions {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(() => {
    const { width, height, scale, fontScale } = Dimensions.get('window');
    return { width, height, scale, fontScale };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        scale: window.scale,
        fontScale: window.fontScale,
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
}

export function useResponsiveInfo(): ResponsiveInfo {
  const dimensions = useScreenDimensions();
  return getResponsiveInfo(dimensions);
}

export function useIsMobile(): boolean {
  const { isMobile } = useResponsiveInfo();
  return isMobile;
}

export function useIsDesktop(): boolean {
  const { isDesktop } = useResponsiveInfo();
  return isDesktop;
}

export function useOrientation(): 'portrait' | 'landscape' {
  const { orientation } = useResponsiveInfo();
  return orientation;
}

// Chart-specific responsive utilities
export function getChartLayoutConfig(responsiveInfo: ResponsiveInfo) {
  const { isDesktop, isMobile, dimensions } = responsiveInfo;

  if (isDesktop) {
    return {
      layoutMode: 'desktop' as const,
      sidebarWidth: 280,
      showFixedSidebar: true,
      showBottomToolbar: false,
      editorPadding: 32,
    };
  }

  return {
    layoutMode: 'mobile' as const,
    sidebarWidth: 0,
    showFixedSidebar: false,
    showBottomToolbar: true,
    editorPadding: 16,
    toolbarHeight: {
      collapsed: 0,
      peek: Math.floor(dimensions.height * 0.25),
      expanded: Math.floor(dimensions.height * 0.5),
    },
  };
}

export function getTouchTargetSize(baseSize: number, isMobile: boolean): number {
  if (!isMobile) return baseSize;

  const withPadding = baseSize + MOBILE_SPECS.touchPadding * 2;
  return Math.max(withPadding, MOBILE_SPECS.minimumTouchTarget);
}

export function getFurnitureHitArea(furnitureSize: number, isMobile: boolean): number {
  if (!isMobile) return furnitureSize;

  return Math.max(furnitureSize, MOBILE_SPECS.furnitureHitArea);
}

// Platform-specific utilities
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export function getPlatformConfig() {
  return {
    isIOS,
    isAndroid,
    isWeb,
    supportsHaptics: isIOS || isAndroid,
    supportsForceTouch: isIOS,
    supportsShake: isIOS || isAndroid,
  };
}
