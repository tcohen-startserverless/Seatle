import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { ArrowLeft, Square, Circle, Save } from 'lucide-react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { useGetChart } from '@/api/hooks/charts';
import {
  useListChartSeats,
  useCreateSeat,
  useUpdateSeat,
  useDeleteSeat,
  useBulkCreateSeats,
} from '@/api/hooks/seats';

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

  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
  } = useGetChart({ id: id || '' });

  const {
    data: seatsData,
    isLoading: seatsLoading,
    error: seatsError,
  } = useListChartSeats(id || '');

  const createSeatMutation = useCreateSeat(id || '');
  const updateSeatMutation = useUpdateSeat();
  const deleteSeatMutation = useDeleteSeat();

  const [furniture, setFurniture] = useState<FurniturePosition[]>([]);

  const isLoading = chartLoading || seatsLoading;
  const error = chartError || seatsError;

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
    if (!seatsData?.data) {
      return;
    }

    // Convert seat data from backend to furniture format
    const furnitureItems: FurniturePosition[] = [];

    // Add tables and chairs from the seats data
    seatsData.data.forEach((seat) => {
      // Determine furniture type
      const type = seat.type === 'TABLE' ? 'TABLE' : 'CHAIR';

      // Calculate cells for tables based on dimensions
      const cells =
        type === 'TABLE' ? Math.floor((seat.width * seat.height) / (25 * 25)) : 1;

      furnitureItems.push({
        id: seat.id,
        x: seat.x,
        y: seat.y,
        size: type === 'TABLE' ? seat.width : seat.height,
        type,
        cells,
        personId: seat.personId,
        // We'd need to fetch person name from a person API if needed
      });
    });

    setFurniture(furnitureItems);
  }, [seatsData]);

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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText>Loading chart...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error loading chart: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (!chartData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Chart not found</ThemedText>
      </ThemedView>
    );
  }

  const handleChairClick = (chairId: string) => {
    const chair = furniture.find((item) => item.id === chairId && item.type === 'CHAIR');
    if (!chair) return;
    Alert.alert(
      'Assign Person',
      chair.personId
        ? `This seat is assigned to ${chair.personName || 'a person'}`
        : `You would assign a person to chair ${chairId} here.`,
      chair.personId
        ? [
            { text: 'OK' },
            {
              text: 'Remove Assignment',
              onPress: () => {
                setFurniture((prev) =>
                  prev.map((item) =>
                    item.id === chairId
                      ? { ...item, personId: undefined, personName: undefined }
                      : item
                  )
                );
              },
            },
          ]
        : [{ text: 'OK' }]
    );
  };

  const handleSaveLayout = async () => {
    if (!chartData || !id) {
      Alert.alert('Error', 'Chart data not loaded');
      return;
    }

    try {
      // Prepare tables and chairs to be saved
      const tables = furniture.filter((item) => item.type === 'TABLE');
      const chairs = furniture.filter((item) => item.type === 'CHAIR');

      // Get the current seat IDs to track what's been removed
      const existingSeatIds = seatsData?.data?.map((seat) => seat.id) || [];
      const currentFurnitureIds = furniture.map((item) => item.id);

      // Find seats that have been removed
      const removedSeatIds = existingSeatIds.filter(
        (seatId) => !currentFurnitureIds.includes(seatId)
      );

      // Create or update seats based on the current furniture
      const createPromises = [];
      const updatePromises = [];

      // Process all furniture items
      for (const item of furniture) {
        // Prepare data for the API
        const seatData = {
          x: item.x,
          y: item.y,
          width: item.type === 'TABLE' ? item.size : item.size,
          height: item.type === 'TABLE' ? item.size : item.size,
          type: item.type,
          chartId: id,
          personId: item.personId,
        };

        // If the seat already exists, update it
        if (existingSeatIds.includes(item.id)) {
          updatePromises.push(
            updateSeatMutation.mutateAsync({
              chartId: id,
              id: item.id,
              data: seatData,
            })
          );
        } else {
          // Otherwise create a new seat
          createPromises.push(
            createSeatMutation.mutateAsync({
              ...seatData,
              id: item.id,
            })
          );
        }
      }

      // Remove deleted seats
      const deletePromises = removedSeatIds.map((seatId) =>
        deleteSeatMutation.mutateAsync({
          chartId: id,
          id: seatId,
        })
      );

      // Execute all operations
      await Promise.all([...createPromises, ...updatePromises, ...deletePromises]);

      Alert.alert('Save Layout', 'Layout saved successfully!', [
        { text: 'OK', onPress: () => router.push('/charts') },
      ]);
    } catch (error) {
      console.error('Error saving layout:', error);
      Alert.alert('Error', 'Failed to save layout');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content]}>
        <View style={styles.leftPanel}>
          <View style={styles.header}>
            <Pressable onPress={() => router.push('/charts')} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">{chartData?.name || 'Chart Design'}</ThemedText>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
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
    color: 'black',
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
