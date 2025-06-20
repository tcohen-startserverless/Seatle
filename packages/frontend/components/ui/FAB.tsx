import { StyleSheet, Pressable } from 'react-native';
import { useTheme, useSpacing, useRadius } from '@/theme';
import { Plus } from 'lucide-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const insets = useSafeAreaInsets();

  const backgroundColor = theme.colors.tint;
  const iconColor = theme.colors.background;

  return (
    <Pressable
      style={[
        styles.fab,
        {
          backgroundColor,
          bottom: insets.bottom + spacing.md,
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
