import { StyleSheet, View, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useThemeColor } from '@/theme';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { ArrowLeft, Square, Circle, Save } from 'lucide-react';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { useState } from 'react';
import { FurniturePosition } from '@/components/FloorPlanEditor/types';
import { useListLists, useGetList } from '@/api/hooks/lists';
import { useCreateChart } from '@/api/hooks/charts';
import { useAuth } from '@/hooks/useAuth';
import { useBulkCreateFurniture } from '@/api/hooks/furniture';
import { useCreateAssignment } from '@/api/hooks/assignments';
import { hasCollision } from '@/utils/furnitureHelpers';
import { TABLE_SIZES, CHAIR_SIZES } from '@/types/furniture';
import { FurnitureDetailPanel } from '@/components/charts/FurnitureDetailPanel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FurnitureType = 'TABLE' | 'CHAIR';

type CustomFurniturePosition = FurniturePosition & {
  personId?: string;
  personName?: string;
};

export default function CreateClassScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const { user } = useAuth();
  const createChartMutation = useCreateChart();
  const isCreating = createChartMutation.isPending;
  const insets = useSafeAreaInsets();

  const [furniture, setFurniture] = useState<CustomFurniturePosition[]>([]);

  const [chartName, setChartName] = useState('');
  const [chartDescription, setChartDescription] = useState('');

  const [selectedListId, setSelectedListId] = useState<string>('');

  const [selectedFurniture, setSelectedFurniture] = useState<FurniturePosition | null>(
    null
  );

  const { data: listsData } = useListLists();

  const { data: selectedListData, isLoading: selectedListLoading } = useGetList({
    id: selectedListId || '',
  });

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

  const handleFurnitureClick = (furnitureId: string) => {
    const selectedItem = furniture.find((item) => item.id === furnitureId);
    setSelectedFurniture((prev) =>
      prev?.id === furnitureId ? null : selectedItem || null
    );
  };

  const assignPersonToChair = (personId: string, personName: string) => {
    if (!selectedFurniture || selectedFurniture.type !== 'CHAIR') return;

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
            <ThemedText style={styles.furnitureLabel}>Table</ThemedText>
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
            <ThemedText style={styles.furnitureLabel}>Chair</ThemedText>
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
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <View
          style={[
            styles.leftPanel,
            { borderRightColor: borderColor, paddingLeft: insets.left },
          ]}
        >
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

        <View style={[styles.rightPanel, { paddingRight: insets.right }]}>
          <FloorPlanEditor
            furniture={furniture}
            onFurnitureUpdate={(updatedFurniture) => {
              setFurniture(updatedFurniture as CustomFurniturePosition[]);
            }}
            edgePadding={32}
            onFurnitureSelect={handleFurnitureClick}
          />
        </View>

        {selectedFurniture && (
          <FurnitureDetailPanel
            selectedFurniture={selectedFurniture}
            onClose={() => setSelectedFurniture(null)}
            onDelete={handleDeleteFurniture}
            people={selectedListData?.people}
            onAssignPerson={assignPersonToChair}
            onRemovePerson={removePersonFromChair}
            isLoading={selectedListLoading}
          />
        )}
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
    width: '100%',
    flexDirection: 'row',
  },
  leftPanel: {
    paddingTop: 32,
    paddingRight: 32,
    paddingBottom: 32,
    paddingLeft: 48,
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
    fontSize: 12,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 4,
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
});
