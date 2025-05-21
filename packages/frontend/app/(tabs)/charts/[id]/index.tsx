import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { ArrowLeft } from 'lucide-react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { useGetChart, useUpdateChartLayout } from '@/api/hooks/charts';
import { useGetList } from '@/api/hooks/lists';
import { FurniturePosition } from '@/types/furniture';
import { hasCollision } from '@/utils/furnitureHelpers';
import { FurnitureOptions } from '@/components/charts/FurnitureOptions';
import { ChairAssignmentModal } from '@/components/charts/ChairAssignmentModal';
import { ChartActions } from '@/components/charts/ChartActions';

export default function ChartDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'text');

  const {
    data: chartData,
    isLoading: chartLoading,
    error,
  } = useGetChart({ id: id || '' });

  const updateLayoutMutation = useUpdateChartLayout();

  const [personAssignmentVisible, setPersonAssignmentVisible] = useState(false);
  const [selectedChairId, setSelectedChairId] = useState<string | null>(null);
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

  const handleChairClick = (chairId: string) => {
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

    setAssignments((prev) => {
      const currentAssignment = prev[selectedChairId];
      if (currentAssignment) {
        return {
          ...prev,
          [selectedChairId]: { ...currentAssignment, personId },
        };
      } else {
        return {
          ...prev,
          [selectedChairId]: { id: `temp-${Date.now()}`, personId },
        };
      }
    });

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

    setAssignments((prev) => {
      const newAssignments = { ...prev };
      delete newAssignments[selectedChairId];
      return newAssignments;
    });

    setPersonAssignmentVisible(false);
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
      <View style={[styles.content]}>
        <View style={styles.leftPanel}>
          <View style={styles.header}>
            <Pressable onPress={() => router.push('/charts')} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">{chartData?.name || 'Chart Design'}</ThemedText>
          </View>

          <FurnitureOptions onAddFurniture={handleAddFurniture} />
          <ChartActions onSave={handleSaveLayout} isSaving={isSaving} />
        </View>

        <View style={styles.rightPanel}>
          <FloorPlanEditor
            furniture={furniture}
            onFurnitureUpdate={(updatedFurniture) => {
              setFurniture(updatedFurniture);
            }}
            onChairAssign={handleChairClick}
            edgePadding={32}
          />
        </View>
      </View>

      <ChairAssignmentModal
        visible={personAssignmentVisible}
        onClose={() => setPersonAssignmentVisible(false)}
        selectedChairId={selectedChairId}
        furniture={furniture}
        listId={chartData.listId}
        isLoading={listLoading}
        error={listError}
        people={listData?.people}
        onAssignPerson={assignPersonToChair}
        onRemovePerson={removePersonFromChair}
      />
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
});
