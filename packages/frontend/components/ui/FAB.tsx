import { StyleSheet, Pressable } from 'react-native';
import { useTheme, useSpacing, useRadius } from '@/theme';
import { Plus } from 'lucide-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const insets = useSafeAreaInsets();
  const { navigationStyle, touchFirst, isTablet, screenWidth } = useAdaptiveDesign();

  // Always call hook (React rules) but only use value for bottom tabs
  const rawTabBarHeight = useBottomTabBarHeight();
  const tabBarHeight = navigationStyle === 'bottom-tabs' ? rawTabBarHeight : 0;

  const backgroundColor = theme.colors.tint;
  const iconColor = theme.colors.background;

  // Calculate bottom position accounting for navigation style
  const getBottomPosition = () => {
    const baseBottom = insets.bottom + spacing.md;

    // Treat medium screens like mobile - use bottom tabs positioning
    if (
      navigationStyle === 'bottom-tabs' ||
      isTablet ||
      (screenWidth >= 768 && screenWidth <= 1200)
    ) {
      return baseBottom + tabBarHeight - insets.bottom; // Tab bar height minus safe area (already included in baseBottom)
    }

    // For desktop sidebar navigation, use base position
    return baseBottom;
  };

  return (
    <Pressable
      style={[
        styles.fab,
        {
          backgroundColor,
          bottom: getBottomPosition(),
          right: insets.right + spacing['2xl'],
          borderRadius: radius.full,
        },
      ]}
      onPress={onPress}
    >
      <Plus size={24} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
