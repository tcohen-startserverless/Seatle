import { StyleSheet, View } from 'react-native';
import { Square } from 'lucide-react';

interface TableIconProps {
  size: number;
  color?: string;
}

export function TableIcon({ size, color = 'brown' }: TableIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Square size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
