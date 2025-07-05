import { StyleSheet, Pressable } from 'react-native';
import { useTheme, useSpacing, useRadius } from '@/theme';
import { Plus } from 'lucide-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const insets = useSafeAreaInsets();
  const { navigationStyle, touchFirst } = useAdaptiveDesign();

  const backgroundColor = theme.colors.tint;
  const iconColor = theme.colors.background;

  // Calculate bottom position accounting for tab bar on mobile
  const getBottomPosition = () => {
    const baseBottom = insets.bottom + spacing.md;

    // Add tab bar height on mobile (60px + safe area)
    if (navigationStyle === 'bottom-tabs') {
      return baseBottom + 60; // Tab bar height
    }

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
