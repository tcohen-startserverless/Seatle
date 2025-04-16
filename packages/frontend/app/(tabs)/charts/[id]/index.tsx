import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft, Square, Circle, Save } from 'lucide-react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { useGetChart } from '@/api/hooks/charts';

type FurnitureType = 'TABLE' | 'CHAIR';

type FurniturePosition = {
  id: string;
  x: number;
  y: number;
  size: number;
  type: FurnitureType;
  cells?: number;
  personId?: string;
  personName?: string;
};

export default function ChartDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'text');

  const { data: chart, isLoading } = useGetChart({ id: id });
  const [furniture, setFurniture] = useState<FurniturePosition[]>([]);

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

  useEffect(() => {
    if (!chart) {
      return;
    }

    const sampleFurniture: FurniturePosition[] = [
      { id: '1', x: 5, y: 5, size: 50, type: 'TABLE', cells: 4 },
      { id: '2', x: 15, y: 5, size: 20, type: 'CHAIR' },
      {
        id: '3',
        x: 5,
        y: 15,
        size: 20,
        type: 'CHAIR',
        personId: 'person1',
        personName: 'John Doe',
      },
    ];

    setFurniture(sampleFurniture);
  }, [chart]);

  const handleAddFurniture = (size: number, type: FurnitureType) => {
    const newItem: FurniturePosition = {
      id: Math.random().toString(),
      x: 0,
      y: 0,
      size,
      type,
      cells: type === 'TABLE' ? Math.pow(Math.floor(size / 25), 2) : 1,
    };

    if (hasCollision(newItem, furniture)) {
      let placed = false;
      for (let y = 0; y < 60 && !placed; y++) {
        for (let x = 0; x < 60 && !placed; x++) {
          const testPosition = { ...newItem, x, y };
          if (!hasCollision(testPosition, furniture)) {
            newItem.x = x;
            newItem.y = y;
            placed = true;
          }
        }
      }
      if (!placed) {
        Alert.alert('Error', 'Not enough space to place this item');
        return;
      }
    }

    setFurniture([...furniture, newItem]);
  };

  const hasCollision = (
    itemToCheck: FurniturePosition,
    allItems: FurniturePosition[]
  ) => {
    for (const item of allItems) {
      if (item.id === itemToCheck.id) continue;

      const rect1 = {
        left: itemToCheck.x,
        right: itemToCheck.x + Math.floor(itemToCheck.size / 25),
        top: itemToCheck.y,
        bottom: itemToCheck.y + Math.floor(itemToCheck.size / 25),
      };
      const rect2 = {
        left: item.x,
        right: item.x + Math.floor(item.size / 25),
        top: item.y,
        bottom: item.y + Math.floor(item.size / 25),
      };
      if (
        !(
          rect1.right <= rect2.left ||
          rect1.left >= rect2.right ||
          rect1.bottom <= rect2.top ||
          rect1.top >= rect2.bottom
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const renderFurnitureOptions = () => {
    return (
      <View style={styles.furnitureOptions}>
        <View style={styles.furnitureSection}>
          <ThemedText style={styles.sectionTitle}>Tables</ThemedText>
          <View style={styles.furnitureGrid}>
            {TABLE_SIZES.map((table) => (
              <Pressable
                key={table.id}
                style={styles.furnitureOption}
                onPress={() => handleAddFurniture(table.size, table.type)}
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
                onPress={() => handleAddFurniture(chair.size, chair.type)}
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
  };

  if (isLoading || !id) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!chart) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Chart not found</ThemedText>
      </ThemedView>
    );
  }

  const handleChairClick = (chairId: string) => {
    Alert.alert('Assign Person', `You would assign a person to chair ${chairId} here.`);
  };

  const handleSaveLayout = async () => {
    Alert.alert('Save Layout', 'Layout saved successfully!', [
      { text: 'OK', onPress: () => router.push('/charts') },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content]}>
        <View style={styles.leftPanel}>
          <View style={styles.header}>
            <Pressable onPress={() => router.push('/charts')} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">
              {chart ? chart.name || 'Chart Design' : 'Chart Design'}
            </ThemedText>
          </View>

          {renderFurnitureOptions()}

          <Pressable
            style={[styles.saveButton, { backgroundColor: tintColor }]}
            onPress={handleSaveLayout}
          >
            <View style={styles.buttonContent}>
              <Save size={18} color="white" />
              <ThemedText style={styles.buttonText}>Save Layout</ThemedText>
            </View>
          </Pressable>
        </View>

        <View style={styles.rightPanel}>
          {/* FloorPlanEditor for tables */}
          <FloorPlanEditor
            tables={furniture
              .filter((item) => item.type === 'TABLE')
              .map((item) => ({
                id: item.id,
                x: item.x,
                y: item.y,
                size: item.size,
                cells: item.cells || 1,
              }))}
            onTableUpdate={(updatedTables) => {
              // Update tables while preserving chairs
              const chairs = furniture.filter((item) => item.type === 'CHAIR');
              const newTables = updatedTables.map((table) => ({
                ...table,
                type: 'TABLE' as FurnitureType,
                cells: table.cells,
              }));
              setFurniture([...newTables, ...chairs]);
            }}
            edgePadding={32}
          />

          {/* Show chair positions as interactive elements */}
          {furniture
            .filter((item) => item.type === 'CHAIR')
            .map((chair) => (
              <Pressable
                key={chair.id}
                style={[
                  styles.chairOverlay,
                  {
                    left: chair.x * 5,
                    top: chair.y * 5,
                    width: chair.size,
                    height: chair.size,
                    backgroundColor: chair.personId ? '#4CAF50' : '#444',
                  },
                ]}
                onPress={() => handleChairClick(chair.id)}
              >
                {chair.personName && (
                  <ThemedText style={styles.personName} numberOfLines={1}>
                    {chair.personName}
                  </ThemedText>
                )}
              </Pressable>
            ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  leftPanel: {
    width: 280,
    padding: 24,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  rightPanel: {
    flex: 1,
    position: 'relative',
  },
  furnitureOptions: {
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
  saveButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chairOverlay: {
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  personName: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
});
