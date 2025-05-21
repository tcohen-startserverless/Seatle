import { StyleSheet, View, TextInput, ScrollView, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useThemeColor } from '@/theme';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { ArrowLeft, Square, Circle, Save, X } from 'lucide-react';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { useState } from 'react';
import { FurniturePosition } from '@/components/FloorPlanEditor/types';
import { useListLists } from '@/api/hooks/lists';
import { useCreateChart } from '@/api/hooks/charts';
import { useAuth } from '@/hooks/useAuth';
import { useBulkCreateFurniture } from '@/api/hooks/furniture';
import { useCreateAssignment } from '@/api/hooks/assignments';
import { hasCollision } from '@/utils/furnitureHelpers';

type FurnitureType = 'TABLE' | 'CHAIR';

type CustomFurniturePosition = FurniturePosition & {
  personId?: string;
  personName?: string;
};

const TABLE_SIZES = [
  { id: '1x1', size: 25, label: '1x1', type: 'TABLE' as const },
  { id: '2x2', size: 50, label: '2x2', type: 'TABLE' as const },
  { id: '3x3', size: 75, label: '3x3', type: 'TABLE' as const },
];

const CHAIR_SIZES = [
  { id: 'chair-small', size: 15, label: 'Small', type: 'CHAIR' as const },
  { id: 'chair-medium', size: 20, label: 'Medium', type: 'CHAIR' as const },
  { id: 'chair-large', size: 25, label: 'Large', type: 'CHAIR' as const },
];

export default function CreateClassScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const { user } = useAuth();
  const createChartMutation = useCreateChart();
  const isCreating = createChartMutation.isPending;

  const [furniture, setFurniture] = useState<CustomFurniturePosition[]>([]);

  const [chartName, setChartName] = useState('');
  const [chartDescription, setChartDescription] = useState('');

  const [selectedListId, setSelectedListId] = useState<string>('');

  const [personAssignmentVisible, setPersonAssignmentVisible] = useState(false);
  const [selectedChairId, setSelectedChairId] = useState<string | null>(null);

  const { data: listsData } = useListLists();

  const handleFurnitureSelect = (size: number, type: FurnitureType) => {
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
    setFurniture((prev) =>
      prev.map((item) =>
        item.id === selectedChairId ? { ...item, personId, personName } : item
      )
    );
    setPersonAssignmentVisible(false);
  };

  const selectList = (listId: string) => {
    setSelectedListId(listId);
  };

  const renderTableOptions = () => {
    return (
      <View style={styles.furnitureGrid}>
        {TABLE_SIZES.map((table) => (
          <Pressable
            key={table.id}
            style={styles.furnitureOption}
            onPress={() => handleFurnitureSelect(table.size, table.type)}
          >
            <View
              style={[
                styles.furniturePreview,
                { width: table.size, height: table.size },
                { marginTop: -(table.size * 0.1) },
              ]}
            >
              <Square size={table.size} color="#8B4513" fill="#8B4513" strokeWidth={1} />
            </View>
            <ThemedText style={styles.furnitureLabel}>{table.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderChairOptions = () => {
    return (
      <View style={styles.furnitureGrid}>
        {CHAIR_SIZES.map((chair) => (
          <Pressable
            key={chair.id}
            style={styles.furnitureOption}
            onPress={() => handleFurnitureSelect(chair.size, chair.type)}
          >
            <View
              style={[styles.furniturePreview, { width: chair.size, height: chair.size }]}
            >
              <Circle size={chair.size} color="#444" fill="#444" strokeWidth={1} />
            </View>
            <ThemedText style={styles.furnitureLabel}>{chair.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    );
  };

  const tintColor = useThemeColor({}, 'tint');

  const renderListOptions = () => {
    if (!listsData?.data || listsData.data.length === 0) {
      return <ThemedText>No lists available</ThemedText>;
    }

    return (
      <View style={styles.listContainer}>
        {listsData.data.map((list) => (
          <Pressable
            key={list.id}
            style={[
              styles.listItem,
              {
                borderColor,
                backgroundColor: selectedListId === list.id ? tintColor : 'transparent',
              },
            ]}
            onPress={() => selectList(list.id)}
          >
            <ThemedText
              style={
                selectedListId === list.id
                  ? { color: '#ffffff', fontWeight: 'bold' }
                  : undefined
              }
            >
              {list.name}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    );
  };

  // Handle saving the chart
  const handleSaveChart = async () => {
    if (!chartName.trim()) {
      Alert.alert('Error', 'Please enter a chart name');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a chart');
      return;
    }

    if (!selectedListId) {
      Alert.alert('Error', 'Please select a list');
      return;
    }

    try {
      const chart = await createChartMutation.mutateAsync({
        name: chartName,
        description: chartDescription,
        listId: selectedListId,
      });

      if (furniture.length > 0) {
        console.log('Creating furniture:', furniture.length);

        const furnitureMutation = useBulkCreateFurniture(chart.chartId);

        const furnitureData = furniture.map((item) => ({
          chartId: chart.chartId,
          id: item.id,
          type: item.type,
          x: item.x,
          y: item.y,
          width: item.type === 'TABLE' ? item.size : item.size,
          height: item.type === 'TABLE' ? item.size : item.size,
        }));

        console.log('Creating furniture items:', furnitureData.length);

        const assignmentsToCreate = furniture
          .filter((item) => item.personId)
          .map((item) => ({
            chartId: chart.chartId,
            furnitureId: item.id,
            personId: item.personId!,
          }));

        if (assignmentsToCreate.length > 0) {
          console.log('Creating assignments:', assignmentsToCreate.length);
        }
      }

      router.push(`/charts/${chart.chartId}`);
    } catch (error) {
      console.error('Error creating chart:', error);
      Alert.alert('Error', 'Failed to create chart');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content]}>
        <View style={[styles.leftPanel, { borderRightColor: borderColor }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.push('/charts')} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">Create Seating Chart</ThemedText>
          </View>

          <View style={styles.chartDetails}>
            <TextInput
              style={[styles.input, { borderColor }]}
              placeholder="Chart Name"
              value={chartName}
              onChangeText={setChartName}
              placeholderTextColor={useThemeColor({}, 'text')}
            />
            <TextInput
              style={[styles.input, { borderColor }]}
              placeholder="Description (Optional)"
              value={chartDescription}
              onChangeText={setChartDescription}
              placeholderTextColor={useThemeColor({}, 'text')}
              multiline
            />
          </View>

          <ScrollView style={styles.scrollContainer}>
            <View style={styles.sections}>
              <CollapsibleSection title="Tables">
                {renderTableOptions()}
              </CollapsibleSection>
              <CollapsibleSection title="Chairs">
                {renderChairOptions()}
              </CollapsibleSection>
              <CollapsibleSection title="Lists">{renderListOptions()}</CollapsibleSection>
            </View>
          </ScrollView>

          <Pressable
            style={[styles.saveButton, { backgroundColor: tintColor }]}
            onPress={handleSaveChart}
            disabled={isCreating}
          >
            {isCreating ? (
              <ThemedText style={styles.saveButtonText}>Saving...</ThemedText>
            ) : (
              <>
                <Save size={18} color="white" />
                <ThemedText style={styles.saveButtonText}>Save Chart</ThemedText>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.rightPanel}>
          <FloorPlanEditor
            furniture={furniture}
            onFurnitureUpdate={(updatedFurniture) => {
              setFurniture(updatedFurniture as CustomFurniturePosition[]);
            }}
            edgePadding={32}
            onChairAssign={handleChairClick}
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
                onLongPress={() => {
                  // Implement actual chair dragging functionality
                  const updatedFurniture = [...furniture];
                  const chairIndex = updatedFurniture.findIndex(
                    (item) => item.id === chair.id
                  );

                  if (chairIndex !== -1) {
                    // Move the chair to a new position to demonstrate movement
                    const newX = Math.max(0, chair.x + 2);
                    const newY = Math.max(0, chair.y + 2);

                    // Make sure we preserve all required properties with their proper types
                    updatedFurniture[chairIndex] = {
                      ...updatedFurniture[chairIndex],
                      id: chair.id, // Ensure id is explicitly set
                      x: newX,
                      y: newY,
                      size: chair.size,
                      type: 'CHAIR' as const,
                      cells: chair.cells || 1,
                    };

                    setFurniture(updatedFurniture);
                  }
                }}
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
              {!selectedListId ? (
                <ThemedText>Please select a list to assign people</ThemedText>
              ) : !listsData?.data ? (
                <ThemedText>Loading people...</ThemedText>
              ) : (
                listsData.data
                  .filter((list) => list.id === selectedListId)
                  .map((list) => (
                    <View key={list.id} style={styles.listPeopleContainer}>
                      <ThemedText type="subtitle">{list.name}</ThemedText>
                      {/* Create sample people for demonstration */}
                      {[1, 2, 3].map((i) => (
                        <Pressable
                          key={`person-${list.id}-${i}`}
                          style={[styles.personItem, { borderColor }]}
                          onPress={() =>
                            assignPersonToChair(
                              `person-${i}`,
                              `Person ${i} from ${list.name}`
                            )
                          }
                        >
                          <ThemedText>{`Person ${i} from ${list.name}`}</ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  ))
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
  content: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  leftPanel: {
    padding: 32,
    borderRightWidth: StyleSheet.hairlineWidth,
    width: 320,
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanel: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  chartDetails: {
    marginBottom: 16,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  sections: {
    gap: 16,
    paddingBottom: 16,
  },
  furnitureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 8,
  },
  furnitureOption: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  furniturePreview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  furnitureLabel: {
    fontSize: 14,
    alignSelf: 'center',
  },
  listContainer: {
    gap: 8,
    padding: 8,
  },
  listItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  chairOverlay: {
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
  listPeopleContainer: {
    marginBottom: 16,
    gap: 8,
  },
  personItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 4,
  },
});
