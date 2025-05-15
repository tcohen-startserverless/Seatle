import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Square, Circle } from 'lucide-react';
import { FurnitureType } from '@/types/furniture';

interface FurnitureOptionsProps {
  onAddFurniture: (size: number, type: FurnitureType) => void;
}

export function FurnitureOptions({ onAddFurniture }: FurnitureOptionsProps) {
  const TABLE_SIZES = [
    { id: '1x1', size: 25, label: '1x1', type: 'TABLE' as FurnitureType },
    { id: '2x2', size: 50, label: '2x2', type: 'TABLE' as FurnitureType },
    { id: '3x3', size: 75, label: '3x3', type: 'TABLE' as FurnitureType },
  ];

  const CHAIR_SIZES = [
    { id: 'chair-small', size: 15, label: 'Small', type: 'CHAIR' as FurnitureType },
    { id: 'chair-medium', size: 20, label: 'Medium', type: 'CHAIR' as FurnitureType },
    { id: 'chair-large', size: 25, label: 'Large', type: 'CHAIR' as FurnitureType },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.furnitureSection}>
        <ThemedText style={styles.sectionTitle}>Tables</ThemedText>
        <View style={styles.furnitureGrid}>
          {TABLE_SIZES.map((table) => (
            <Pressable
              key={table.id}
              style={styles.furnitureOption}
              onPress={() => onAddFurniture(table.size, table.type)}
            >
              <View style={styles.furniturePreview}>
                <Square
                  size={table.size / 2}
                  color="#8B4513"
                  fill="#8B4513"
                  strokeWidth={1}
                />
              </View>
              <ThemedText style={styles.furnitureLabel}>{table.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.furnitureSection}>
        <ThemedText style={styles.sectionTitle}>Chairs</ThemedText>
        <View style={styles.furnitureGrid}>
          {CHAIR_SIZES.map((chair) => (
            <Pressable
              key={chair.id}
              style={styles.furnitureOption}
              onPress={() => onAddFurniture(chair.size, chair.type)}
            >
              <View style={styles.furniturePreview}>
                <Circle
                  size={chair.size / 2}
                  color="#444"
                  fill="#444"
                  strokeWidth={1}
                />
              </View>
              <ThemedText style={styles.furnitureLabel}>{chair.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  furnitureSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  furnitureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  furnitureOption: {
    alignItems: 'center',
    width: 70,
    marginBottom: 8,
  },
  furniturePreview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  furnitureLabel: {
    fontSize: 12,
  },
});