import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Square, Trash2 } from 'lucide-react';
import { TablePosition } from './types';

interface TablesProps {
  tables: TablePosition[];
  selectedTableId: string | null;
  cellSize: number;
  onTablePress: (id: string) => void;
  onDeleteTable: (id: string, e: GestureResponderEvent) => void;
}

export function Tables({
  tables,
  selectedTableId,
  cellSize,
  onTablePress,
  onDeleteTable,
}: TablesProps) {
  return (
    <>
      {tables.map((table) => (
        <Animated.View
          key={table.id}
          style={[
            styles.table,
            {
              left: table.x * cellSize,
              top: table.y * cellSize,
              width: table.size,
              height: table.size,
            },
          ]}
        >
          <Pressable onPress={() => onTablePress(table.id)} style={styles.tableWrapper}>
            <Square size={table.size} color="#8B4513" fill="#8B4513" strokeWidth={1} />
          </Pressable>
          {selectedTableId === table.id && (
            <Pressable
              style={styles.deleteButton}
              onPressIn={(e) => {
                e.stopPropagation();
                onDeleteTable(table.id, e);
              }}
              hitSlop={15}
            >
              <View style={styles.deleteButtonInner}>
                <Trash2 size={20} color="red" />
              </View>
            </Pressable>
          )}
        </Animated.View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  table: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -30,
    right: -30,
    zIndex: 100,
    elevation: 6,
  },
  deleteButtonInner: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 101,
  },
});
