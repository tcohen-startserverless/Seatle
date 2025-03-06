import { StyleSheet, View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { ArrowLeft, Square, Save } from 'lucide-react';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { useState } from 'react';
import { TablePosition } from '@/components/FloorPlanEditor/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCreateSeating } from '@/hooks/seating/useCreateSeating';
import { Button } from '@/components/Button';

const TABLE_SIZES = [
  { id: '1x1', size: 25, label: '1x1' },
  { id: '2x2', size: 50, label: '2x2' },
  { id: '3x3', size: 75, label: '3x3' },
];

export default function CreateSeatingScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const createMutation = useCreateSeating();
  
  // Hard-coded values for now - would come from context or params in a real app
  const schoolId = '123';
  const classId = '456';
  
  const [name, setName] = useState('New Seating Chart');
  const [tables, setTables] = useState<TablePosition[]>([]);

  const handleSave = async () => {
    try {
      // Map table positions to seat entities
      const seats = tables.map(table => ({
        schoolId,
        classId,
        x: table.x,
        y: table.y,
        size: table.size,
      }));
      
      await createMutation.mutateAsync({
        seating: {
          schoolId,
          classId,
          name,
          rows: 60,
          columns: 60,
        },
        seats,
      });
      
      router.back();
    } catch (error) {
      console.error('Failed to create seating chart', error);
    }
  };

  const hasCollision = (tableToCheck: TablePosition, allTables: TablePosition[]) => {
    for (const table of allTables) {
      if (table.id === tableToCheck.id) continue;
      
      const rect1 = {
        left: tableToCheck.x,
        right: tableToCheck.x + Math.floor(tableToCheck.size / 25),
        top: tableToCheck.y,
        bottom: tableToCheck.y + Math.floor(tableToCheck.size / 25),
      };
      const rect2 = {
        left: table.x,
        right: table.x + Math.floor(table.size / 25),
        top: table.y,
        bottom: table.y + Math.floor(table.size / 25),
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

  const handleTableSelect = (size: number) => {
    const newTable: TablePosition = {
      id: Math.random().toString(),
      x: 0,
      y: 0,
      size,
      cells: Math.pow(Math.floor(size / 25), 2),
    };

    if (hasCollision(newTable, tables)) {
      let placed = false;
      for (let y = 0; y < 60 && !placed; y++) {
        for (let x = 0; x < 60 && !placed; x++) {
          const testPosition = { ...newTable, x, y };
          if (!hasCollision(testPosition, tables)) {
            newTable.x = x;
            newTable.y = y;
            placed = true;
          }
        }
      }
      if (!placed) {
        return;
      }
    }

    setTables([...tables, newTable]);
  };

  const renderTableOptions = () => {
    return (
      <View style={styles.tableGrid}>
        {TABLE_SIZES.map((table) => (
          <Pressable
            key={table.id}
            style={styles.tableOption}
            onPress={() => handleTableSelect(table.size)}
          >
            <View
              style={[
                styles.tablePreview,
                { width: table.size, height: table.size },
                { marginTop: -(table.size * 0.1) },
              ]}
            >
              <Square size={table.size} color="#8B4513" fill="#8B4513" strokeWidth={1} />
            </View>
            <ThemedText style={styles.tableLabel}>{table.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content]}>
        <View style={[styles.leftPanel, { borderRightColor: borderColor }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">Create Seating Chart</ThemedText>
          </View>
          
          <View style={styles.nameInputContainer}>
            <ThemedText>Chart Name:</ThemedText>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter chart name"
            />
          </View>
          
          <View style={styles.sections}>
            <CollapsibleSection title="Tables">{renderTableOptions()}</CollapsibleSection>
          </View>
          
          <View style={styles.footer}>
            <Button 
              onPress={handleSave}
              disabled={createMutation.isPending || tables.length === 0 || !name}
              icon={<Save size={20} color="white" />}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Chart'}
            </Button>
          </View>
        </View>
        <View style={styles.rightPanel}>
          <FloorPlanEditor tables={tables} onTableUpdate={setTables} edgePadding={32} />
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
    width: '100%',
    flexDirection: 'row',
  },
  leftPanel: {
    width: 300,
    padding: 24,
    borderRightWidth: StyleSheet.hairlineWidth,
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanel: {
    flex: 1,
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
  nameInputContainer: {
    marginBottom: 24,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  sections: {
    flex: 1,
    gap: 16,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 8,
  },
  tableOption: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  tablePreview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableLabel: {
    fontSize: 14,
    alignSelf: 'center',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
  },
});