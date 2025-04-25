import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { ArrowLeft, Square, Circle, Save, X, User } from 'lucide-react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { useGetChart, useUpdateChartLayout } from '@/api/hooks/charts';
import { useListChartFurniture } from '@/api/hooks/furniture';
import { useListChartAssignments } from '@/api/hooks/assignments';
import { useGetList } from '@/api/hooks/lists';

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
    data: furnitureData,
    isLoading: furnitureLoading,
    error: furnitureError,
  } = useListChartFurniture(id || '');

  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useListChartAssignments(id || '', '');

  const updateLayoutMutation = useUpdateChartLayout();

  const [personAssignmentVisible, setPersonAssignmentVisible] = useState(false);
  const [selectedChairId, setSelectedChairId] = useState<string | null>(null);
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
  } = useGetList({
    id: chartData?.listId || '',
  });

  const [furniture, setFurniture] = useState<FurniturePosition[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isLoading = chartLoading || furnitureLoading || assignmentsLoading || isSaving;
  const error = chartError || furnitureError || assignmentsError;

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
    if (!furnitureData?.data || !assignmentsData?.data) {
      return;
    }

    const furnitureItems: FurniturePosition[] = [];

    furnitureData.data.forEach((item) => {
      const type = item.type === 'TABLE' ? 'TABLE' : 'CHAIR';
      const cells =
        type === 'TABLE' ? Math.floor((item.width * item.height) / (25 * 25)) : 1;

      const assignment = assignmentsData.data.find((a) => a.furnitureId === item.id);

      furnitureItems.push({
        id: item.id,
        x: item.x,
        y: item.y,
        size: type === 'TABLE' ? item.width : item.height,
        type,
        cells,
        personId: assignment?.personId,
      });
    });

    setFurniture(furnitureItems);
  }, [furnitureData, assignmentsData]);

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

    const assignment = assignmentsData?.data.find((a) => a.furnitureId === chairId);

    // Set the selected chair and show the people assignment modal
    setSelectedChairId(chairId);
    setPersonAssignmentVisible(true);
  };

  const assignPersonToChair = (personId: string, personName: string) => {
    if (!selectedChairId) return;

    setFurniture((prev) =>
      prev.map((item) =>
        item.id === selectedChairId ? { ...item, personId, personName } : item
      )
    );
    setPersonAssignmentVisible(false);
  };

  const removePersonFromChair = () => {
    if (!selectedChairId) return;

    setFurniture((prev) =>
      prev.map((item) =>
        item.id === selectedChairId
          ? { ...item, personId: undefined, personName: undefined }
          : item
      )
    );
    setPersonAssignmentVisible(false);
  };

  const handleSaveLayout = async () => {
    if (!chartData || !id) {
      Alert.alert('Error', 'Chart data not loaded');
      return;
    }

    setIsSaving(true);
    try {
      const existingFurnitureIds = furnitureData?.data?.map((item) => item.id) || [];
      const currentFurnitureIds = furniture.map((item) => item.id);

      const furnitureToDelete = existingFurnitureIds.filter(
        (itemId) => !currentFurnitureIds.includes(itemId)
      );

      const existingAssignments = assignmentsData?.data || [];

      const existingItems = furniture.filter((item) =>
        existingFurnitureIds.includes(item.id)
      );
      const newItems = furniture.filter(
        (item) => !existingFurnitureIds.includes(item.id)
      );

      const assignmentsToCreate: { furnitureId: string; personId: string }[] = [];
      const assignmentsToDelete: string[] = [];

      furniture.forEach((item) => {
        if (item.personId) {
          const existingAssignment = existingAssignments.find(
            (a) => a.furnitureId === item.id
          );

          if (!existingAssignment) {
            assignmentsToCreate.push({
              furnitureId: item.id,
              personId: item.personId,
            });
          } else if (existingAssignment.personId !== item.personId) {
            assignmentsToDelete.push(existingAssignment.id);
            assignmentsToCreate.push({
              furnitureId: item.id,
              personId: item.personId,
            });
          }
        }
      });

      existingAssignments.forEach((assignment) => {
        const furnItem = furniture.find((item) => item.id === assignment.furnitureId);
        if (!furnItem || !furnItem.personId) {
          assignmentsToDelete.push(assignment.id);
        }
      });

      const layoutUpdateData = {
        furnitureToCreate: newItems.map((item) => ({
          id: item.id,
          x: item.x,
          y: item.y,
          width: item.type === 'TABLE' ? item.size : item.size,
          height: item.type === 'TABLE' ? item.size : item.size,
          type: item.type,
        })),

        furnitureToUpdate: existingItems.map((item) => ({
          id: item.id,
          data: {
            x: item.x,
            y: item.y,
            width: item.type === 'TABLE' ? item.size : item.size,
            height: item.type === 'TABLE' ? item.size : item.size,
            type: item.type,
          },
        })),

        furnitureToDelete,
        assignmentsToCreate,
        assignmentsToDelete,
      };

      console.log(
        `Saving layout changes: ${layoutUpdateData.furnitureToCreate.length} furniture to create, ${layoutUpdateData.furnitureToUpdate.length} to update, ${layoutUpdateData.furnitureToDelete.length} to delete, ${assignmentsToCreate.length} assignments to create, ${assignmentsToDelete.length} assignments to delete`
      );

      const result = await updateLayoutMutation.mutateAsync({
        id,
        data: layoutUpdateData,
      });

      if (result.transaction.success) {
        Alert.alert('Save Layout', 'Layout saved successfully!', [
          { text: 'OK', onPress: () => router.push('/charts') },
        ]);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error saving layout:', error);
      Alert.alert(
        'Error',
        `Failed to save layout: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSaving(false);
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
            style={[
              styles.saveButton,
              { backgroundColor: tintColor, opacity: isSaving ? 0.7 : 1 },
            ]}
            onPress={handleSaveLayout}
            disabled={isSaving}
          >
            <View style={styles.buttonContent}>
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Save size={18} color="white" />
              )}
              <ThemedText style={styles.buttonText}>
                {isSaving ? 'Saving...' : 'Save Layout'}
              </ThemedText>
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

      <Modal
        visible={personAssignmentVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPersonAssignmentVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">Assign Person to Seat</ThemedText>
              <Pressable onPress={() => setPersonAssignmentVisible(false)}>
                <X size={24} color={iconColor} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalContent}>
              {!chartData?.listId ? (
                <ThemedText>No list associated with this chart</ThemedText>
              ) : listLoading ? (
                <ActivityIndicator size="small" color={tintColor} />
              ) : listError ? (
                <ThemedText>Error loading people: {listError.message}</ThemedText>
              ) : !listData?.people || listData.people.length === 0 ? (
                <ThemedText>No people found in this list</ThemedText>
              ) : (
                <View>
                  {selectedChairId && (
                    <View style={styles.currentAssignment}>
                      {(() => {
                        const chair = furniture.find(
                          (item) => item.id === selectedChairId
                        );
                        const assignment = assignmentsData?.data.find(
                          (a) => a.furnitureId === selectedChairId
                        );

                        if (chair?.personId) {
                          return (
                            <>
                              <ThemedText style={styles.assignmentText}>
                                Current: {chair.personName || 'Unknown person'}
                              </ThemedText>
                              <Pressable
                                style={[
                                  styles.removeButton,
                                  { backgroundColor: '#FF3B30' },
                                ]}
                                onPress={removePersonFromChair}
                              >
                                <ThemedText style={styles.removeButtonText}>
                                  Remove
                                </ThemedText>
                              </Pressable>
                            </>
                          );
                        }
                        return (
                          <ThemedText style={styles.assignmentText}>
                            No person currently assigned
                          </ThemedText>
                        );
                      })()}
                    </View>
                  )}

                  <ThemedText style={styles.sectionTitle}>People</ThemedText>
                  {listData.people.map((person) => (
                    <Pressable
                      key={person.id}
                      style={[styles.personItem, { borderColor }]}
                      onPress={() =>
                        assignPersonToChair(
                          person.id,
                          `${person.firstName} ${person.lastName}`
                        )
                      }
                    >
                      <View style={styles.personRow}>
                        <User size={18} color={iconColor} />
                        <ThemedText style={styles.personName}>
                          {person.firstName} {person.lastName}
                        </ThemedText>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '80%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalContent: {
    flex: 1,
  },
  currentAssignment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  assignmentText: {
    fontWeight: '500',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  personItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 4,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
