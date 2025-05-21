import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { X, User } from 'lucide-react';
import { FurniturePosition, Person } from '@/types/furniture';
import { useThemeColor } from '@/theme';

interface ChairAssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  selectedChairId: string | null;
  furniture: FurniturePosition[];
  listId?: string;
  isLoading: boolean;
  error?: Error | null;
  people?: Person[];
  onAssignPerson: (personId: string, personName: string) => void;
  onRemovePerson: () => void;
}

export function ChairAssignmentModal({
  visible,
  onClose,
  selectedChairId,
  furniture,
  listId,
  isLoading,
  error,
  people,
  onAssignPerson,
  onRemovePerson,
}: ChairAssignmentModalProps) {
  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const chair = furniture.find((item) => item.id === selectedChairId);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle">Assign Person to Seat</ThemedText>
            <Pressable onPress={onClose}>
              <X size={24} color={iconColor} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {!listId ? (
              <ThemedText>No list associated with this chart</ThemedText>
            ) : isLoading ? (
              <ActivityIndicator size="small" color={tintColor} />
            ) : error ? (
              <ThemedText>Error loading people: {error.message}</ThemedText>
            ) : !people || people.length === 0 ? (
              <ThemedText>No people found in this list</ThemedText>
            ) : (
              <View>
                {selectedChairId && (
                  <View style={styles.currentAssignment}>
                    {chair?.personId ? (
                      <>
                        <ThemedText style={styles.assignmentText}>
                          Current: {chair.personName || 'Unknown person'}
                        </ThemedText>
                        <Pressable
                          style={[styles.removeButton, { backgroundColor: '#FF3B30' }]}
                          onPress={onRemovePerson}
                        >
                          <ThemedText style={styles.removeButtonText}>
                            Remove
                          </ThemedText>
                        </Pressable>
                      </>
                    ) : (
                      <ThemedText style={styles.assignmentText}>
                        No person currently assigned
                      </ThemedText>
                    )}
                  </View>
                )}

                <ThemedText style={styles.sectionTitle}>People</ThemedText>
                {people.map((person) => {
                  const assignedToSeat = furniture.some(
                    item => item.personId === person.id && item.id !== selectedChairId
                  );
                  
                  return (
                    <Pressable
                      key={person.id}
                      style={[
                        styles.personItem, 
                        { borderColor },
                        chair?.personId === person.id && { backgroundColor: tintColor + '20' }
                      ]}
                      onPress={() =>
                        onAssignPerson(
                          person.id,
                          `${person.firstName} ${person.lastName}`
                        )
                      }
                    >
                      <View style={styles.personRow}>
                        <User size={18} color={iconColor} />
                        <View style={styles.personInfo}>
                          <ThemedText style={styles.personName}>
                            {person.firstName} {person.lastName}
                          </ThemedText>
                          {person.email && (
                            <ThemedText style={styles.personDetail}>
                              {person.email}
                            </ThemedText>
                          )}
                        </View>
                        {assignedToSeat && (
                          <ThemedText style={styles.assignedBadge}>
                            Assigned
                          </ThemedText>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 14,
    fontWeight: '500',
  },
  personDetail: {
    fontSize: 12,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  assignedBadge: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
    backgroundColor: '#FF950020',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});