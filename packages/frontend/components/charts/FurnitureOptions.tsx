import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Square, Circle } from 'lucide-react';
import { FurnitureType, TABLE_SIZES, CHAIR_SIZES } from '@/types/furniture';
import { useResponsiveInfo, getTouchTargetSize } from '@/utils/responsive';
import { useTheme } from '@/theme';

interface FurnitureOptionsProps {
  onAddFurniture: (size: number, type: FurnitureType) => void;
}

export function FurnitureOptions({ onAddFurniture }: FurnitureOptionsProps) {
  const { theme } = useTheme();
  const responsiveInfo = useResponsiveInfo();
  const { isMobile } = responsiveInfo;

  const touchTargetSize = getTouchTargetSize(70, isMobile);

  console.log('FurnitureOptions rendering:', {
    isMobile,
    touchTargetSize,
    tableCount: TABLE_SIZES.length,
    chairCount: CHAIR_SIZES.length,
  });

  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      <View style={styles.furnitureSection}>
        <ThemedText style={styles.sectionTitle}>Tables</ThemedText>
        <View style={[styles.furnitureGrid, isMobile && styles.mobileGrid]}>
          {TABLE_SIZES.map((table) => (
            <Pressable
              key={table.id}
              style={[
                styles.furnitureOption,
                isMobile && [
                  styles.mobileFurnitureOption,
                  { minHeight: touchTargetSize },
                ],
              ]}
              onPress={() => {
                console.log('Table pressed:', table);
                onAddFurniture(table.size, table.type);
              }}
            >
              <View style={styles.furniturePreview}>
                <Square
                  size={isMobile ? Math.max(table.size / 2, 20) : table.size / 2}
                  color="#8B4513"
                  fill="#8B4513"
                  strokeWidth={1}
                />
              </View>
              <ThemedText
                style={[styles.furnitureLabel, isMobile && styles.mobileFurnitureLabel]}
              >
                Table
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.furnitureSection}>
        <ThemedText style={styles.sectionTitle}>Chairs</ThemedText>
        <View style={[styles.furnitureGrid, isMobile && styles.mobileGrid]}>
          {CHAIR_SIZES.map((chair) => (
            <Pressable
              key={chair.id}
              style={[
                styles.furnitureOption,
                isMobile && [
                  styles.mobileFurnitureOption,
                  { minHeight: touchTargetSize },
                ],
              ]}
              onPress={() => {
                console.log('Chair pressed:', chair);
                onAddFurniture(chair.size, chair.type);
              }}
            >
              <View style={styles.furniturePreview}>
                <Circle
                  size={isMobile ? Math.max(chair.size / 2, 20) : chair.size / 2}
                  color="#444"
                  fill="#444"
                  strokeWidth={1}
                />
              </View>
              <ThemedText
                style={[styles.furnitureLabel, isMobile && styles.mobileFurnitureLabel]}
              >
                Chair
              </ThemedText>
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
    paddingLeft: 16,
  },
  mobileContainer: {
    paddingLeft: 0,
    paddingHorizontal: 16,
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
  mobileGrid: {
    justifyContent: 'space-between',
    gap: 16,
  },
  furnitureOption: {
    alignItems: 'center',
    width: 70,
    marginBottom: 8,
  },
  mobileFurnitureOption: {
    width: 80,
    minWidth: 44,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  furniturePreview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  furnitureLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  mobileFurnitureLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
