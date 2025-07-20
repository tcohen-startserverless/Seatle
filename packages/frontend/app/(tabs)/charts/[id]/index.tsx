import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { FAB } from '@/components/ui/FAB';

import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { useGetChart, useUpdateChartLayout } from '@/api/hooks/charts';
import { useGetList } from '@/api/hooks/lists';
import { FurniturePosition } from '@/types/furniture';
import { hasCollision } from '@/utils/furnitureHelpers';
import { FurnitureOptions } from '@/components/charts/FurnitureOptions';
import { FurnitureDetailPanel } from '@/components/charts/FurnitureDetailPanel';
import { ChartActions } from '@/components/charts/ChartActions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveInfo } from '@/utils/responsive';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';

export default function ChartDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'text');
  const insets = useSafeAreaInsets();

  const {
    data: chartData,
    isLoading: chartLoading,
    error,
  } = useGetChart({ id: id || '' });

  const updateLayoutMutation = useUpdateChartLayout();
  const responsiveInfo = useResponsiveInfo();
  const { contentWidth, availableWidth } = useAdaptiveDesign();

  const [selectedFurniture, setSelectedFurniture] = useState<FurniturePosition | null>(
    null
  );
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showFurnitureModal, setShowFurnitureModal] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
  } = useGetList({
    id: chartData?.listId || '',
  });

  const [furniture, setFurniture] = useState<
    (FurniturePosition & { personId?: string; personName?: string })[]
  >([]);
  const [assignments, setAssignments] = useState<
    Record<string, { id: string; personId: string }>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const isLoading = chartLoading || isSaving;

  useEffect(() => {
    if (!chartData?.furniture) {
      return;
    }

    const furnitureItems: (FurniturePosition & {
      personId?: string;
      personName?: string;
    })[] = [];
    const assignmentsMap: Record<string, { id: string; personId: string }> = {};

    if (chartData.assignments && chartData.assignments.length > 0) {
      chartData.assignments.forEach((assignment) => {
        assignmentsMap[assignment.furnitureId] = {
          id: assignment.id,
          personId: assignment.personId,
        };
      });
    }

    chartData.furniture.forEach((item) => {
      const type = item.type === 'TABLE' ? 'TABLE' : 'CHAIR';
      const cells =
        type === 'TABLE' ? Math.floor((item.width * item.height) / (25 * 25)) : 1;

      const assignment = assignmentsMap[item.id];
      let personId: string | undefined;
      let personName: string | undefined;

      if (assignment && listData?.people) {
        personId = assignment.personId;
        const person = listData.people.find((p) => p.id === personId);
        if (person) {
          personName = `${person.firstName} ${person.lastName}`;
        }
      }

      furnitureItems.push({
        id: item.id,
        x: item.x,
        y: item.y,
        size: type === 'TABLE' ? item.width : item.height,
        type,
        cells,
        personId,
        personName,
      });
    });

    setFurniture(furnitureItems);
    setAssignments(assignmentsMap);
  }, [chartData, listData]);

  const handleAddFurniture = (size: number, type: 'TABLE' | 'CHAIR') => {
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

  const handleFurnitureClick = (furnitureId: string) => {
    const selectedItem = furniture.find((item) => item.id === furnitureId);
    setSelectedFurniture((prev) =>
      prev?.id === furnitureId ? null : selectedItem || null
    );
  };

  const assignPersonToChair = (personId: string, personName: string) => {
    if (!selectedFurniture) return;

    setFurniture((prev) =>
      prev.map((item) => {
        if (item.personId === personId && item.id !== selectedFurniture.id) {
          return { ...item, personId: undefined, personName: undefined };
        }
        if (item.id === selectedFurniture.id) {
          return { ...item, personId, personName };
        }
        return item;
      })
    );

    setAssignments((prev) => {
      const newAssignments = { ...prev };

      Object.keys(newAssignments).forEach((furnitureId) => {
        if (
          newAssignments[furnitureId]?.personId === personId &&
          furnitureId !== selectedFurniture.id
        ) {
          delete newAssignments[furnitureId];
        }
      });

      const currentAssignment = newAssignments[selectedFurniture.id];
      if (currentAssignment) {
        newAssignments[selectedFurniture.id] = { ...currentAssignment, personId };
      } else {
        newAssignments[selectedFurniture.id] = { id: `temp-${Date.now()}`, personId };
      }

      return newAssignments;
    });

    setSelectedFurniture({
      ...selectedFurniture,
      personId,
      personName,
    });
  };

  const removePersonFromChair = () => {
    if (!selectedFurniture || selectedFurniture.type !== 'CHAIR') return;

    setFurniture((prev) =>
      prev.map((item) =>
        item.id === selectedFurniture.id
          ? { ...item, personId: undefined, personName: undefined }
          : item
      )
    );

    setAssignments((prev) => {
      const newAssignments = { ...prev };
      delete newAssignments[selectedFurniture.id];
      return newAssignments;
    });
    setSelectedFurniture({
      ...selectedFurniture,
      personId: undefined,
      personName: undefined,
    });
  };

  const handleDeleteFurniture = (furnitureId: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setFurniture((prev) => prev.filter((item) => item.id !== furnitureId));
          setSelectedFurniture(null);
        },
      },
    ]);
  };

  const handleSaveLayout = async () => {
    if (!chartData || !id) {
      Alert.alert('Error', 'Chart data not loaded');
      return;
    }

    setIsSaving(true);
    try {
      const existingFurnitureIds = chartData.furniture.map((item) => item.id) || [];
      const currentFurnitureIds = furniture.map((item) => item.id);

      const furnitureToDelete = existingFurnitureIds.filter(
        (itemId) => !currentFurnitureIds.includes(itemId)
      );

      const existingItems = furniture.filter((item) =>
        existingFurnitureIds.includes(item.id)
      );
      const newItems = furniture.filter(
        (item) => !existingFurnitureIds.includes(item.id)
      );

      const existingAssignments = chartData.assignments || [];
      const existingAssignmentIds = existingAssignments.map((a) => a.id);
      const currentAssignmentFurnitureIds = Object.keys(assignments);

      const furnitureWithAssignments = furniture.filter(
        (f) => f.personId && f.type === 'CHAIR'
      );

      const assignmentsToCreate = furnitureWithAssignments
        .filter((f) => {
          const assignment = assignments[f.id];
          return !assignment || !existingAssignmentIds.includes(assignment.id);
        })
        .map((f) => ({
          furnitureId: f.id,
          personId: f.personId!,
        }));

      const assignmentsToUpdate = furnitureWithAssignments
        .filter((f) => {
          const assignment = assignments[f.id];
          return (
            assignment &&
            assignment.id.indexOf('temp-') === -1 &&
            existingAssignmentIds.includes(assignment.id) &&
            existingAssignments.some(
              (a) => a.id === assignment.id && a.personId !== f.personId
            )
          );
        })
        .map((f) => ({
          id: assignments[f.id]?.id || '',
          personId: f.personId!,
        }));

      const assignmentsToDelete = existingAssignments
        .filter((a) => !currentAssignmentFurnitureIds.includes(a.furnitureId))
        .map((a) => a.id);

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
        assignmentsToUpdate,
        assignmentsToDelete,
      };

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

  const closeFurniturePanel = () => {
    setSelectedFurniture(null);
    setShowContextMenu(false);
  };

  const handleFabPress = () => {
    setShowFurnitureModal(true);
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

  return (
    <ThemedView style={styles.container}>
      <View
        style={[styles.content, { width: Math.min(contentWidth, availableWidth - 32) }]}
      >
        {/* Header */}
        <View style={[styles.header]}>
          <Pressable onPress={() => router.push('/charts')} style={styles.backButton}>
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <View style={styles.titleContainer}>
            <ThemedText type="title">{chartData?.name || 'Chart Design'}</ThemedText>
          </View>
          <Pressable
            style={[styles.saveButton, { backgroundColor: tintColor }]}
            onPress={handleSaveLayout}
            disabled={isSaving}
          >
            <ThemedText style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </ThemedText>
          </Pressable>
        </View>

        {/* Floor Plan Editor */}
        <View style={styles.editorContainer}>
          <FloorPlanEditor
            furniture={furniture}
            onFurnitureUpdate={(updatedFurniture) => {
              setFurniture(updatedFurniture);
            }}
            onFurnitureSelect={handleFurnitureClick}
            edgePadding={16}
          />
        </View>

        {/* Floating Action Button */}
        <FAB onPress={handleFabPress} />
      </View>

      {/* Furniture Selection Overlay */}
      {showFurnitureModal && (
        <View style={styles.overlayContainer}>
          <Pressable
            style={styles.overlayBackdrop}
            onPress={() => setShowFurnitureModal(false)}
          />
          <View style={[styles.overlayContent, { backgroundColor }]}>
            <View style={styles.overlayHeader}>
              <ThemedText type="subtitle">Add Furniture</ThemedText>
              <Pressable onPress={() => setShowFurnitureModal(false)}>
                <X size={24} color={iconColor} />
              </Pressable>
            </View>
            <FurnitureOptions
              onAddFurniture={(size, type) => {
                handleAddFurniture(size, type);
                setShowFurnitureModal(false);
              }}
            />
          </View>
        </View>
      )}

      {/* Furniture detail panel */}
      {selectedFurniture && (
        <FurnitureDetailPanel
          selectedFurniture={selectedFurniture}
          onClose={closeFurniturePanel}
          onDelete={handleDeleteFurniture}
          people={listData?.people}
          onAssignPerson={assignPersonToChair}
          onRemovePerson={removePersonFromChair}
          isLoading={listLoading}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    maxWidth: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 60,
  },
  backButton: {
    padding: 8,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  editorContainer: {
    flex: 1,
  },

  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
    minHeight: '40%',
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
