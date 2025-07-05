import { useRadius, useSpacing, useTypography } from '@/theme';
import { useMemo } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useAdaptiveDesign } from './useAdaptiveDesign';

// Responsive value type - can specify values for different breakpoints
export type ResponsiveValue<T> =
  | T
  | {
      mobile?: T;
      tablet?: T;
      desktop?: T;
      default?: T;
    };

// Style types
type Style = ViewStyle | TextStyle | ImageStyle;

// Responsive style utilities interface
export interface ResponsiveStyleUtils {
  // Core responsive value resolver
  responsive: <T>(value: ResponsiveValue<T>) => T;

  // Typography utilities
  text: {
    size: (context?: 'caption' | 'body' | 'title' | 'heading' | 'display') => TextStyle;
    weight: (weight?: 'normal' | 'medium' | 'semibold' | 'bold') => TextStyle;
    adaptive: (mobileSize: number, desktopSize?: number) => TextStyle;
  };

  // Spacing utilities
  space: {
    padding: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl') => ViewStyle;
    margin: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl') => ViewStyle;
    gap: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl') => ViewStyle;
    adaptive: (
      mobileValue: number,
      desktopValue?: number
    ) => {
      padding: ViewStyle;
      margin: ViewStyle;
      paddingHorizontal: ViewStyle;
      paddingVertical: ViewStyle;
      marginHorizontal: ViewStyle;
      marginVertical: ViewStyle;
    };
  };

  // Layout utilities
  layout: {
    container: ViewStyle;
    content: ViewStyle;
    card: ViewStyle;
    touchTarget: (size?: 'small' | 'medium' | 'large') => ViewStyle;
    grid: (columns?: ResponsiveValue<number>) => ViewStyle;
  };

  // Dimension utilities
  size: {
    icon: (context?: 'small' | 'medium' | 'large' | 'tab' | 'card' | 'action') => number;
    minTouch: number;
    cardWidth: number;
    contentWidth: number;
  };

  // Helper functions
  when: {
    mobile: <T>(value: T) => T | undefined;
    tablet: <T>(value: T) => T | undefined;
    desktop: <T>(value: T) => T | undefined;
    touchFirst: <T>(value: T) => T | undefined;
  };

  // Style object creators
  create: {
    responsive: (styles: {
      mobile?: Style;
      tablet?: Style;
      desktop?: Style;
      base?: Style;
    }) => Style;
    adaptive: (mobileStyle: Style, desktopStyle?: Style) => Style;
  };
}

export const useResponsiveStyles = (): ResponsiveStyleUtils => {
  const {
    isMobile,
    isTablet,
    isDesktop,
    touchFirst,
    contentWidth,
    touchTargets,
    getIconSize,
    availableWidth,
  } = useAdaptiveDesign();

  const spacing = useSpacing();
  const typography = useTypography();
  const radius = useRadius();

  return useMemo(() => {
    // Core responsive value resolver with granular window size support
    const responsive = <T>(value: ResponsiveValue<T>): T => {
      if (typeof value !== 'object' || value === null) {
        return value as T;
      }

      const responsiveValue = value as Exclude<ResponsiveValue<T>, T>;

      // Check granular breakpoints based on actual window width
      if (isMobile && responsiveValue.mobile !== undefined) {
        return responsiveValue.mobile;
      }
      if (isTablet && responsiveValue.tablet !== undefined) {
        return responsiveValue.tablet;
      }
      if (isDesktop && responsiveValue.desktop !== undefined) {
        return responsiveValue.desktop;
      }

      return responsiveValue.default as T;
    };

    // Window size-based responsive helper
    const windowResponsive = <T>(values: {
      xlarge?: T;
      large?: T;
      medium?: T;
      small?: T;
      default: T;
    }): T => {
      if (availableWidth >= 1400 && values.xlarge !== undefined) {
        return values.xlarge;
      }
      if (availableWidth >= 1200 && values.large !== undefined) {
        return values.large;
      }
      if (availableWidth >= 1024 && values.medium !== undefined) {
        return values.medium;
      }
      if (availableWidth >= 768 && values.small !== undefined) {
        return values.small;
      }

      return values.default;
    };

    // Typography utilities
    const text = {
      size: (
        context: 'caption' | 'body' | 'title' | 'heading' | 'display' = 'body'
      ): TextStyle => {
        const sizes = {
          caption: responsive({
            mobile: typography.fontSize.sm,
            desktop: typography.fontSize.xs,
          }),
          body: responsive({
            mobile: typography.fontSize.md,
            desktop: typography.fontSize.sm,
          }),
          title: responsive({
            mobile: typography.fontSize.lg,
            desktop: typography.fontSize.md,
          }),
          heading: responsive({
            mobile: typography.fontSize.xl,
            desktop: typography.fontSize.lg,
          }),
          display: responsive({
            mobile: typography.fontSize['2xl'],
            desktop: typography.fontSize.xl,
          }),
        };

        return { fontSize: sizes[context] };
      },

      weight: (
        weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'normal'
      ): TextStyle => {
        const weights = {
          normal: '400' as const,
          medium: '500' as const,
          semibold: '600' as const,
          bold: '700' as const,
        };

        return { fontWeight: weights[weight] };
      },

      adaptive: (mobileSize: number, desktopSize?: number): TextStyle => ({
        fontSize: responsive({
          mobile: mobileSize,
          desktop: desktopSize || Math.max(mobileSize - 2, 12),
        }),
      }),
    };

    // Spacing utilities
    const space = {
      padding: (size: keyof typeof spacing): ViewStyle => ({
        padding: spacing[size],
      }),

      margin: (size: keyof typeof spacing): ViewStyle => ({
        margin: spacing[size],
      }),

      gap: (size: keyof typeof spacing): ViewStyle => ({
        gap: spacing[size],
      }),

      adaptive: (mobileValue: number, desktopValue?: number) => {
        const value = responsive({
          mobile: mobileValue,
          desktop: desktopValue || Math.max(mobileValue * 0.75, 4),
        });

        return {
          padding: { padding: value },
          margin: { margin: value },
          paddingHorizontal: { paddingHorizontal: value },
          paddingVertical: { paddingVertical: value },
          marginHorizontal: { marginHorizontal: value },
          marginVertical: { marginVertical: value },
        };
      },
    };

    // Layout utilities
    const layout = {
      container: {
        flex: 1,
        alignItems: 'center' as const,
      } as ViewStyle,

      content: {
        flex: 1,
        width: '100%' as const,
        maxWidth: responsive({
          mobile: contentWidth,
          desktop: Math.min(contentWidth, 1200),
        }),
        paddingHorizontal: responsive({
          mobile: spacing.md,
          desktop: spacing.xl,
        }),
      } as ViewStyle,

      card: {
        borderRadius: responsive({
          mobile: radius.md,
          desktop: radius.sm,
        }),
        padding: windowResponsive({
          xlarge: spacing.xs,
          large: spacing.sm,
          medium: spacing.sm,
          small: spacing.md,
          default: spacing.md,
        }),
        maxWidth: windowResponsive({
          xlarge: 180,
          large: 220,
          medium: 280,
          small: 320,
          default: 400,
        }),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: responsive({
          mobile: 0.1,
          desktop: 0.03,
        }),
        shadowRadius: responsive({
          mobile: 8,
          desktop: 3,
        }),
        elevation: responsive({
          mobile: 4,
          desktop: 1,
        }),
        borderWidth: 1,
        borderColor: responsive({
          mobile: 'rgba(0, 0, 0, 0.05)',
          desktop: 'rgba(0, 0, 0, 0.08)',
        }),
      } as ViewStyle,

      touchTarget: (size: 'small' | 'medium' | 'large' = 'medium'): ViewStyle => {
        // Desktop gets more compact, precise sizing
        const desktopSizeMap = {
          small: 32,
          medium: 36,
          large: 40,
        };

        // Mobile gets full touch target sizing
        const mobileSizeMap = {
          small: touchTargets.min,
          medium: touchTargets.comfortable,
          large: touchTargets.spacious,
        };

        const targetSize = touchFirst ? mobileSizeMap[size] : desktopSizeMap[size];

        return {
          minHeight: targetSize,
          minWidth: touchFirst ? targetSize : 'auto',
          maxWidth: windowResponsive({
            xlarge: 120,
            large: 160,
            medium: 220,
            small: 280,
            default: 400,
          }),
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          paddingHorizontal: touchFirst ? spacing.md : spacing.sm,
          paddingVertical: touchFirst ? spacing.sm : spacing.xs,
        };
      },

      grid: (columns?: ResponsiveValue<number>): ViewStyle => {
        const cols = responsive(columns || { mobile: 1, tablet: 2, desktop: 3 });
        return {
          flexDirection: cols > 1 ? ('row' as const) : ('column' as const),
          flexWrap: cols > 1 ? ('wrap' as const) : ('nowrap' as const),
        };
      },
    };

    // Size utilities
    const size = {
      icon: getIconSize,
      minTouch: touchTargets.min,
      cardWidth: windowResponsive({
        xlarge: 180,
        large: 220,
        medium: 250,
        small: 300,
        default: 280,
      }),
      contentWidth,
    };

    // Conditional helpers
    const when = {
      mobile: <T>(value: T): T | undefined => (isMobile ? value : undefined),
      tablet: <T>(value: T): T | undefined => (isTablet ? value : undefined),
      desktop: <T>(value: T): T | undefined => (isDesktop ? value : undefined),
      touchFirst: <T>(value: T): T | undefined => (touchFirst ? value : undefined),
    };

    // Style creators
    const create = {
      responsive: (styles: {
        mobile?: Style;
        tablet?: Style;
        desktop?: Style;
        base?: Style;
      }): Style => {
        const baseStyle = styles.base || {};
        const platformStyle = isMobile
          ? styles.mobile
          : isTablet
            ? styles.tablet
            : styles.desktop;

        return StyleSheet.flatten([baseStyle, platformStyle]);
      },

      adaptive: (mobileStyle: Style, desktopStyle?: Style): Style => {
        return isMobile ? mobileStyle : desktopStyle || mobileStyle;
      },
    };

    return {
      responsive,
      windowResponsive,
      text,
      space,
      layout,
      size,
      when,
      create,
    };
  }, [
    isMobile,
    isTablet,
    isDesktop,
    touchFirst,
    contentWidth,
    touchTargets,
    getIconSize,
    availableWidth,
    spacing,
    typography,
    radius,
  ]);
};

// Convenience hooks for specific use cases
export const useResponsiveValue = <T>(value: ResponsiveValue<T>): T => {
  const { responsive } = useResponsiveStyles();
  return responsive(value);
};

export const useAdaptiveStyle = (mobileStyle: Style, desktopStyle?: Style): Style => {
  const { create } = useResponsiveStyles();
  return create.adaptive(mobileStyle, desktopStyle);
};

export const useResponsiveText = (
  mobileSize: number,
  desktopSize?: number
): TextStyle => {
  const { text } = useResponsiveStyles();
  return text.adaptive(mobileSize, desktopSize);
};

export const useResponsiveSpacing = (mobileValue: number, desktopValue?: number) => {
  const { space } = useResponsiveStyles();
  return space.adaptive(mobileValue, desktopValue);
};
