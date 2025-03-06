import { StyleSheet, View, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ClassSchemas } from '@core/class';
import { useCreateStudent } from '@/hooks/student/mutations';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { ArrowLeft, Square } from 'lucide-react';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { useState } from 'react';
import { TablePosition } from '@/components/FloorPlanEditor/types';

const TABLE_SIZES = [
  { id: '1x1', size: 25, label: '1x1' },
  { id: '2x2', size: 50, label: '2x2' },
  { id: '3x3', size: 75, label: '3x3' },
];

export default function CreateClassScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const schoolId = '098';
  const createMutation = useCreateStudent(schoolId);
  const [tables, setTables] = useState<TablePosition[]>([]);

  const hasCollision = (tableToCheck: TablePosition, allTables: TablePosition[]) => {
    for (const table of allTables) {
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
            <Pressable onPress={() => router.push('/people')} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">Create Seating Chart</ThemedText>
          </View>
          <View style={styles.sections}>
            <CollapsibleSection title="Tables">{renderTableOptions()}</CollapsibleSection>
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
    padding: 32,
    borderRightWidth: StyleSheet.hairlineWidth,
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
  sections: {
    marginTop: 24,
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
});
