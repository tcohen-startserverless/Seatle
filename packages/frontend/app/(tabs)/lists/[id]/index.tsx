import {
  StyleSheet,
  View,
  useWindowDimensions,
  Pressable,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft, ListChecks, UserPlus } from 'lucide-react';
import { useGetList } from '@/api/hooks/lists';
import { Button } from '@/components/Button';
import { AddPersonModal } from '@/components/modals/AddPersonModal';
import { EditPersonModal } from '@/components/modals/EditPersonModal';
import { MovePersonModal } from '@/components/modals/MovePersonModal';
import { PersonCard } from '@/components/ui/PersonCard';
import { useState } from 'react';
import { useCreatePerson, useDeletePerson, useUpdatePerson } from '@/api/hooks/persons';
import type { PersonItem } from '@core/person';
const isWeb = Platform.OS === 'web';

function ListDetailSkeleton({
  contentWidth,
  iconColor,
  onBack,
}: {
  contentWidth: number;
  iconColor: string;
  onBack: () => void;
}) {
  const skeletonColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');

  return (
    <View style={[styles.content, { width: contentWidth }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={iconColor} />
        </Pressable>
        <ThemedText type="title">List Details</ThemedText>
      </View>

      {isWeb ? (
        <View style={styles.webContainer}>
          <View
            style={[
              styles.webPanel,
              styles.webLeftPanel,
              { backgroundColor: cardBackground },
            ]}
          >
            <View style={styles.iconContainer}>
              <ListChecks size={isWeb ? 48 : 32} color={iconColor} />
            </View>
            <View
              style={[
                styles.skeleton,
                styles.skeletonTitle,
                { backgroundColor: skeletonColor },
              ]}
            />
            <View
              style={[
                styles.skeleton,
                styles.skeletonDescription,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>

          <View
            style={[
              styles.webPanel,
              styles.webRightPanel,
              { backgroundColor: cardBackground },
            ]}
          >
            <View style={styles.webPanelHeader}>
              <View
                style={[
                  styles.skeleton,
                  { height: 28, width: 120, backgroundColor: skeletonColor },
                ]}
              />
            </View>
            <View
              style={[styles.emptyItems, { borderColor: skeletonColor, opacity: 0.6 }]}
            >
              <ThemedText style={styles.emptyText}>Loading items...</ThemedText>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.detailsContainer}>
          <View style={styles.iconContainer}>
            <ListChecks size={32} color={iconColor} />
          </View>

          <View style={styles.detailsContent}>
            <View
              style={[
                styles.skeleton,
                styles.skeletonTitle,
                { backgroundColor: skeletonColor },
              ]}
            />

            <View
              style={[
                styles.skeleton,
                styles.skeletonDescription,
                { backgroundColor: skeletonColor },
              ]}
            />

            <View
              style={[styles.emptyItems, { borderColor: skeletonColor, opacity: 0.6 }]}
            >
              <ThemedText style={styles.emptyText}>Loading items...</ThemedText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const iconColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'card');
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(isWeb ? 1400 : 800, screenWidth - 32);

  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [editPersonModalVisible, setEditPersonModalVisible] = useState(false);
  const [movePersonModalVisible, setMovePersonModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);

  const {
    data: list,
    isFetching,
    error,
    isLoading,
    refetch: refetchList,
  } = useGetList({ id: id });

  const createPersonMutation = useCreatePerson();
  const updatePersonMutation = useUpdatePerson();
  const deletePersonMutation = useDeletePerson();

  const showSkeleton = isLoading || isFetching;

  const people = list?.people || [];
  const isPeopleLoading = isLoading;

  const handleAddPerson = async (values: any) => {
    try {
      await createPersonMutation.mutateAsync({
        ...values,
        listId: id,
      });
      refetchList();
    } catch (error) {
      console.error('Failed to add person:', error);
    }
  };

  const handleEditPerson = async (values: any) => {
    if (!selectedPerson) return;

    try {
      await updatePersonMutation.mutateAsync({
        ...values,
        id: selectedPerson.id,
      });
      refetchList();
    } catch (error) {
      console.error('Failed to update person:', error);
    }
  };

  const handleDeletePerson = async (person: PersonItem) => {
    if (Platform.OS === 'web') {
      if (
        !confirm(
          `Are you sure you want to delete ${person.firstName} ${person.lastName}?`
        )
      ) {
        return;
      }
    } else {
      Alert.alert(
        'Delete Person',
        `Are you sure you want to delete ${person.firstName} ${person.lastName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePersonMutation.mutateAsync({ id: person.id });
                refetchList();
              } catch (error) {
                console.error('Failed to delete person:', error);
              }
            },
          },
        ]
      );
      return;
    }

    try {
      await deletePersonMutation.mutateAsync({ id: person.id });
      refetchList();
    } catch (error) {
      console.error('Failed to delete person:', error);
    }
  };

  const handleMovePerson = async (targetListId: string) => {
    if (!selectedPerson) return;

    try {
      await updatePersonMutation.mutateAsync({
        id: selectedPerson.id,
        listId: targetListId,
        firstName: selectedPerson.firstName,
        lastName: selectedPerson.lastName,
        email: selectedPerson.email,
        phone: selectedPerson.phone,
        notes: selectedPerson.notes,
      });
      refetchList();
    } catch (error) {
      console.error('Failed to move person:', error);
    }
  };

  if (showSkeleton) {
    return (
      <ThemedView style={styles.container}>
        <ListDetailSkeleton
          contentWidth={contentWidth}
          iconColor={iconColor}
          onBack={() => router.push('/lists')}
        />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">Error</ThemedText>
          </View>
          <ThemedText>Could not load list details</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!list && !isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">List Not Found</ThemedText>
          </View>
          <ThemedText>The requested list could not be found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!list) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">List Not Found</ThemedText>
          </View>
          <ThemedText>The requested list could not be found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <ThemedText type="title">List Details</ThemedText>
          {isFetching && <View style={styles.loadingIndicator} />}
        </View>

        {isWeb ? (
          <View style={styles.webContainer}>
            <View
              style={[
                styles.webPanel,
                styles.webLeftPanel,
                { backgroundColor: cardBackground },
              ]}
            >
              <View style={styles.iconContainer}>
                <ListChecks size={48} color={iconColor} />
              </View>
              <ThemedText style={styles.webListName}>{list.name}</ThemedText>

              {list.description ? (
                <ThemedText style={styles.webDescription}>{list.description}</ThemedText>
              ) : (
                <ThemedText style={styles.webNoDescription}>No description</ThemedText>
              )}

              <View style={styles.webActionButtons}>
                <View style={styles.buttonWrapper}>
                  <UserPlus size={16} color="#0066ff" style={styles.buttonIcon} />
                  <Button
                    style={styles.actionButton}
                    onPress={() => setAddPersonModalVisible(true)}
                  >
                    Add Person
                  </Button>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.webPanel,
                styles.webRightPanel,
                { backgroundColor: cardBackground },
              ]}
            >
              <View style={styles.webPanelHeader}>
                <ThemedText style={styles.webPanelTitle}>People</ThemedText>
              </View>

              {isPeopleLoading ? (
                <View style={styles.loadingContainer}>
                  <ThemedText>Loading people...</ThemedText>
                </View>
              ) : people.length === 0 ? (
                <View style={styles.emptyItems}>
                  <ThemedText style={styles.emptyText}>
                    No people in this list yet
                  </ThemedText>
                </View>
              ) : (
                <FlatList
                  data={people}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <PersonCard
                      person={item}
                      onEdit={() => {
                        setSelectedPerson(item);
                        setEditPersonModalVisible(true);
                      }}
                      onDelete={() => handleDeletePerson(item)}
                      onMove={() => {
                        setSelectedPerson(item);
                        setMovePersonModalVisible(true);
                      }}
                    />
                  )}
                  style={styles.peopleList}
                />
              )}
            </View>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.iconContainer}>
              <ListChecks size={32} color={iconColor} />
            </View>

            <View style={styles.detailsContent}>
              <ThemedText style={styles.listName}>{list.name}</ThemedText>

              {list.description ? (
                <ThemedText style={styles.description}>{list.description}</ThemedText>
              ) : (
                <ThemedText style={styles.noDescription}>No description</ThemedText>
              )}

              {isPeopleLoading ? (
                <View style={styles.loadingContainer}>
                  <ThemedText>Loading people...</ThemedText>
                </View>
              ) : people.length === 0 ? (
                <View style={styles.emptyItems}>
                  <ThemedText style={styles.emptyText}>
                    No people in this list yet
                  </ThemedText>
                </View>
              ) : (
                <FlatList
                  data={people}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <PersonCard
                      person={item}
                      onEdit={() => {
                        setSelectedPerson(item);
                        setEditPersonModalVisible(true);
                      }}
                      onDelete={() => handleDeletePerson(item)}
                      onMove={() => {
                        setSelectedPerson(item);
                        setMovePersonModalVisible(true);
                      }}
                    />
                  )}
                  style={styles.peopleList}
                />
              )}

              <View style={styles.buttonWrapper}>
                <UserPlus size={16} color="#0066ff" style={styles.buttonIcon} />
                <Button
                  style={styles.mobileActionButton}
                  onPress={() => setAddPersonModalVisible(true)}
                >
                  Add Person
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* Person Management Modals */}
        <AddPersonModal
          visible={addPersonModalVisible}
          onClose={() => setAddPersonModalVisible(false)}
          onSubmit={handleAddPerson}
          isSubmitting={createPersonMutation.status === 'pending'}
          listId={id}
        />

        {selectedPerson && (
          <EditPersonModal
            visible={editPersonModalVisible}
            onClose={() => {
              setEditPersonModalVisible(false);
              setSelectedPerson(null);
            }}
            onSubmit={handleEditPerson}
            isSubmitting={updatePersonMutation.status === 'pending'}
            person={selectedPerson}
          />
        )}

        {selectedPerson && (
          <MovePersonModal
            visible={movePersonModalVisible}
            onClose={() => {
              setMovePersonModalVisible(false);
              setSelectedPerson(null);
            }}
            onMove={handleMovePerson}
            isMoving={updatePersonMutation.status === 'pending'}
            currentListId={id}
            personName={`${selectedPerson.firstName} ${selectedPerson.lastName}`}
          />
        )}
      </View>
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
    width: '100%',
    padding: 16,
  },
  peopleList: {
    flex: 1,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    maxWidth: isWeb ? 1200 : 400,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    padding: 8,
  },
  webContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 24,
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  webPanel: {
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  webLeftPanel: {
    flex: 1,
    minWidth: 300,
    alignItems: 'center',
  },
  webRightPanel: {
    flex: 2,
    minWidth: 400,
  },
  webPanelHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 16,
  },
  webPanelTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  webListName: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  webDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600,
  },
  webNoDescription: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  webActionButtons: {
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
  },
  actionButton: {
    marginTop: 16,
  },
  mobileActionButton: {
    marginTop: 24,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  buttonIcon: {
    marginRight: 8,
    position: 'relative',
    zIndex: 1,
  },
  detailsContainer: {
    maxWidth: isWeb ? 800 : 400,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  detailsContent: {
    width: '100%',
  },
  listName: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: isWeb ? 12 : 8,
  },
  description: {
    fontSize: isWeb ? 18 : 16,
    textAlign: 'center',
    marginBottom: isWeb ? 32 : 24,
  },
  noDescription: {
    fontSize: isWeb ? 18 : 16,
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: isWeb ? 32 : 24,
    fontStyle: 'italic',
  },
  emptyItems: {
    padding: isWeb ? 48 : 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  emptyText: {
    opacity: 0.6,
    fontSize: isWeb ? 16 : 14,
  },
  skeleton: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonTitle: {
    height: isWeb ? 32 : 24,
    width: isWeb ? '40%' : '60%',
    alignSelf: 'center',
    marginBottom: 8,
  },
  skeletonDescription: {
    height: isWeb ? 18 : 16,
    width: isWeb ? '60%' : '80%',
    alignSelf: 'center',
    marginBottom: isWeb ? 32 : 24,
  },
  loadingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066ff',
    marginLeft: 8,
  },
});
