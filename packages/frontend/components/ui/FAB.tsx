import { StyleSheet, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Plus } from 'lucide-react';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const backgroundColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'background');

  return (
    <Pressable style={[styles.fab, { backgroundColor }]} onPress={onPress}>
      <Plus size={24} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
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
