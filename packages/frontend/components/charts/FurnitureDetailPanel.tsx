import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { X, Trash2 } from 'lucide-react';
import { FurniturePosition, Person } from '@/types/furniture';

interface FurnitureDetailPanelProps {
  selectedFurniture: FurniturePosition | null;
  onClose: () => void;
  onDelete: (furnitureId: string) => void;
  people?: Person[];
  onAssignPerson: (personId: string, personName: string) => void;
  onRemovePerson: () => void;
  isLoading?: boolean;
}

export function FurnitureDetailPanel({
  selectedFurniture,
  onClose,
  onDelete,
  people,
  onAssignPerson,
  onRemovePerson,
  isLoading = false,
}: FurnitureDetailPanelProps) {
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'text');
  const dangerColor = '#FF3B30';

  if (!selectedFurniture) {
    return null;
  }

  const isChair = selectedFurniture.type === 'CHAIR';
  const hasAssignment = Boolean(selectedFurniture.personId);

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <ThemedText type="subtitle">
          {isChair ? 'Chair Settings' : 'Table Settings'}
        </ThemedText>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={20} color={iconColor} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Position</ThemedText>
          <View style={styles.positionInfo}>
            <ThemedText>X: {selectedFurniture.x}</ThemedText>
            <ThemedText>Y: {selectedFurniture.y}</ThemedText>
          </View>
        </View>

        {isChair && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Seat Assignment</ThemedText>
            
            {hasAssignment && (
              <View style={[styles.currentAssignment, { borderColor }]}>
                <ThemedText style={styles.assignmentName}>
                  {selectedFurniture.personName}
                </ThemedText>
                <Pressable 
                  onPress={onRemovePerson} 
                  style={[styles.removeButton, { borderColor: dangerColor }]}
                >
                  <ThemedText style={{ color: dangerColor }}>Remove</ThemedText>
                </Pressable>
              </View>
            )}

            {!hasAssignment && (
              <>
                {isLoading ? (
                  <ThemedText>Loading people...</ThemedText>
                ) : !people?.length ? (
                  <ThemedText>No people available to assign</ThemedText>
                ) : (
                  <ScrollView style={styles.peopleList}>
                    {people.map((person) => (
                      <Pressable
                        key={person.id}
                        style={[styles.personItem, { borderColor }]}
                        onPress={() => 
                          onAssignPerson(
                            person.id, 
                            `${person.firstName} ${person.lastName}`
                          )
                        }
                      >
                        <ThemedText>{`${person.firstName} ${person.lastName}`}</ThemedText>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </>
            )}
          </View>
        )}

        <Pressable 
          style={[styles.deleteButton, { backgroundColor: dangerColor }]}
          onPress={() => onDelete(selectedFurniture.id)}
        >
          <Trash2 size={18} color="white" />
          <ThemedText style={styles.deleteButtonText}>Delete {isChair ? 'Chair' : 'Table'}</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    borderLeftWidth: 1,
    height: '100%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  positionInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  currentAssignment: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  assignmentName: {
    fontWeight: '500',
    marginBottom: 8,
  },
  removeButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    alignItems: 'center',
  },
  peopleList: {
    maxHeight: 200,
  },
  personItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 'auto',
    gap: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});