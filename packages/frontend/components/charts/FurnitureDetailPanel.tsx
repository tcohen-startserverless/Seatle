import React from 'react';
import { StyleSheet, View, Pressable, ScrollView, Modal, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { X, Trash2 } from 'lucide-react';
import { FurniturePosition, Person } from '@/types/furniture';
import { useResponsiveInfo, getTouchTargetSize } from '@/utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'text');
  const dangerColor = '#FF3B30';
  const responsiveInfo = useResponsiveInfo();
  const { isMobile } = responsiveInfo;
  const insets = useSafeAreaInsets();

  if (!selectedFurniture) {
    return null;
  }

  const isChair = selectedFurniture.type === 'CHAIR';
  const hasAssignment = Boolean(selectedFurniture.personId);
  const touchTargetHeight = getTouchTargetSize(44, isMobile);

  // Mobile: Show as modal
  if (isMobile) {
    return (
      <Modal
        visible={true}
        transparent
        animationType="slide"
        statusBarTranslucent={Platform.OS === 'android'}
      >
        <View style={styles.mobileBackdrop}>
          <Pressable style={styles.mobileBackdropPressable} onPress={onClose} />
          <View
            style={[
              styles.mobileContainer,
              { backgroundColor, paddingBottom: insets.bottom },
            ]}
          >
            <View style={[styles.mobileHeader, { borderBottomColor: borderColor }]}>
              <View style={styles.mobileHandle} />
              <ThemedText type="subtitle">
                {isChair ? 'Chair Settings' : 'Table Settings'}
              </ThemedText>
              <Pressable
                onPress={onClose}
                style={[styles.closeButton, { minHeight: touchTargetHeight }]}
              >
                <X size={24} color={iconColor} />
              </Pressable>
            </View>
            <ScrollView style={styles.mobileContent} showsVerticalScrollIndicator={false}>
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
                    <View
                      style={[
                        styles.currentAssignment,
                        styles.mobileAssignment,
                        { borderColor },
                      ]}
                    >
                      <ThemedText style={styles.assignmentName}>
                        {selectedFurniture.personName}
                      </ThemedText>
                      <Pressable
                        onPress={onRemovePerson}
                        style={[
                          styles.removeButton,
                          styles.mobileRemoveButton,
                          { borderColor: dangerColor, minHeight: touchTargetHeight },
                        ]}
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
                        <View style={styles.peopleList}>
                          {people.map((person) => (
                            <Pressable
                              key={person.id}
                              style={[
                                styles.personItem,
                                styles.mobilePersonItem,
                                { borderColor, minHeight: touchTargetHeight },
                              ]}
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
                        </View>
                      )}
                    </>
                  )}
                </View>
              )}

              <Pressable
                style={[
                  styles.deleteButton,
                  styles.mobileDeleteButton,
                  { backgroundColor: dangerColor, minHeight: touchTargetHeight },
                ]}
                onPress={() => onDelete(selectedFurniture.id)}
              >
                <Trash2 size={20} color="white" />
                <ThemedText style={styles.deleteButtonText}>
                  Delete {isChair ? 'Chair' : 'Table'}
                </ThemedText>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  // Desktop: Show as sidebar
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
          <ThemedText style={styles.deleteButtonText}>
            Delete {isChair ? 'Chair' : 'Table'}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Desktop styles
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

  // Mobile styles
  mobileBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  mobileBackdropPressable: {
    flex: 1,
  },
  mobileContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    minHeight: '40%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  mobileHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
  },
  mobileContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mobileAssignment: {
    padding: 16,
    borderRadius: 12,
  },
  mobileRemoveButton: {
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  mobilePersonItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mobileDeleteButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
  },
});
