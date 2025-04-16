import {
  StyleSheet,
  View,
  useWindowDimensions,
  Pressable,
  Platform,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  ArrowLeft,
  ListChecks,
  UserPlus,
  Edit,
  ArrowRightLeft,
  Trash2,
} from 'lucide-react';
import { useGetList } from '@/api/hooks/lists';
import { Button } from '@/components/Button';
import { AddPersonModal } from '@/components/modals/AddPersonModal';
import { EditPersonModal } from '@/components/modals/EditPersonModal';
import { MovePersonModal } from '@/components/modals/MovePersonModal';
import { PersonCard } from '@/components/ui/PersonCard';
import { useState, useRef, useEffect } from 'react';
import { useCreatePerson, useDeletePerson, useUpdatePerson } from '@/api/hooks/persons';
import type { PersonItem } from '@seater/core/person';
import { Animated, Easing } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { listKeys } from '@/api/hooks/lists/keys';
import { TextInput } from '@/components/TextInput';
import { useForm } from '@tanstack/react-form';

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

      <View style={styles.detailsContainer}>
        <View style={styles.compactHeaderSkeleton}>
          <View style={styles.iconContainer}>
            <ListChecks size={24} color={iconColor} />
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
            styles.skeletonPanel,
            { backgroundColor: cardBackground, marginBottom: 24 },
          ]}
        >
          <View
            style={[
              styles.skeleton,
              { height: 24, width: 150, backgroundColor: skeletonColor },
            ]}
          />
          <View
            style={[
              styles.skeleton,
              { height: 100, marginTop: 16, backgroundColor: skeletonColor },
            ]}
          />
        </View>

        <View style={[styles.skeletonPanel, { backgroundColor: cardBackground }]}>
          <View
            style={[
              styles.skeleton,
              { height: 24, width: 120, backgroundColor: skeletonColor },
            ]}
          />
          <View style={[styles.emptyItems, { borderColor: skeletonColor, opacity: 0.6 }]}>
            <ThemedText style={styles.emptyText}>Loading items...</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

function AddPersonInlineForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
}) {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: undefined,
      phone: undefined,
      notes: undefined,
    } as PersonItem,
    onSubmit: async ({ value }) => {
      try {
        onSubmit(value);
        form.reset();
      } catch (error) {
        console.error('Failed to add person:', error);
      }
    },
  });

  return (
    <View style={styles.inlineForm}>
      <ThemedText style={styles.inlineFormTitle}>Add New Person</ThemedText>

      <View style={styles.inlineFormRow}>
        <form.Field name="firstName">
          {(field) => (
            <View style={styles.inlineFormField}>
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="First Name"
                style={styles.inlineInput}
              />
            </View>
          )}
        </form.Field>

        <form.Field name="lastName">
          {(field) => (
            <View style={styles.inlineFormField}>
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Last Name"
                style={styles.inlineInput}
              />
            </View>
          )}
        </form.Field>
      </View>

      <View style={styles.inlineFormRow}>
        <form.Field name="email">
          {(field) => (
            <View style={styles.inlineFormField}>
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Email"
                style={styles.inlineInput}
                keyboardType="email-address"
              />
            </View>
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <View style={styles.inlineFormField}>
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Phone"
                style={styles.inlineInput}
                keyboardType="phone-pad"
              />
            </View>
          )}
        </form.Field>
      </View>

      <form.Field name="notes">
        {(field) => (
          <View style={styles.inlineFormField}>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Notes"
              style={[styles.inlineInput, styles.notesInput]}
              multiline
              numberOfLines={2}
            />
          </View>
        )}
      </form.Field>

      <Button
        onPress={() => form.handleSubmit()}
        style={styles.inlineButton}
        isLoading={isSubmitting}
      >
        Add Person
      </Button>
    </View>
  );
}

function PersonGrid({
  people,
  onEditPerson,
  onDeletePerson,
  onMovePerson,
  deletingPersonId,
}: {
  people: PersonItem[];
  onEditPerson: (person: PersonItem) => void;
  onDeletePerson: (person: PersonItem) => void;
  onMovePerson: (person: PersonItem) => void;
  deletingPersonId: string | null;
}) {
  const { width } = useWindowDimensions();
  const cardBackground = useThemeColor({}, 'card');
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (deletingPersonId) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [deletingPersonId]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate number of columns based on screen width
  const numColumns = Math.max(1, Math.floor(width / 350));

  return (
    <View style={styles.gridContainer}>
      {people.map((person) => (
        <View
          key={person.id}
          style={[styles.gridItem, { width: `${100 / numColumns}%` }]}
        >
          <View style={[styles.gridCard, { backgroundColor: cardBackground }]}>
            <ThemedText style={styles.personName}>
              {person.firstName} {person.lastName}
            </ThemedText>

            {person.email && (
              <ThemedText style={styles.personDetail}>Email: {person.email}</ThemedText>
            )}

            {person.phone && (
              <ThemedText style={styles.personDetail}>Phone: {person.phone}</ThemedText>
            )}

            {person.notes && (
              <ThemedText style={styles.personDetail}>Notes: {person.notes}</ThemedText>
            )}

            <View style={styles.personActions}>
              <Pressable style={styles.iconButton} onPress={() => onEditPerson(person)}>
                <Edit size={20} color="#0066ff" />
              </Pressable>

              <Pressable style={styles.iconButton} onPress={() => onMovePerson(person)}>
                <ArrowRightLeft size={20} color="#0066ff" />
              </Pressable>

              <Pressable
                style={[
                  styles.iconButton,
                  styles.deleteIconButton,
                  deletingPersonId === person.id && styles.deletingIconButton,
                ]}
                onPress={() => onDeletePerson(person)}
                disabled={deletingPersonId === person.id}
              >
                {deletingPersonId === person.id ? (
                  <View style={styles.spinnerContainer}>
                    <Animated.View
                      style={[styles.spinner, { transform: [{ rotate: spin }] }]}
                    />
                  </View>
                ) : (
                  <Trash2 size={20} color="#ffffff" />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const iconColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'card');
  const backgroundColor = useThemeColor({}, 'background');
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(isWeb ? 1200 : 800, screenWidth - 32);

  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [editPersonModalVisible, setEditPersonModalVisible] = useState(false);
  const [movePersonModalVisible, setMovePersonModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);

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
  const isDeleting = deletePersonMutation.isPending;

  const handleAddPerson = async (values: any) => {
    try {
      await createPersonMutation.mutateAsync({
        ...values,
        listId: id,
      });
      // Cache is updated by the hook
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
        listId: id, // Include current listId
      });
      // Cache is updated by the hook
    } catch (error) {
      console.error('Failed to update person:', error);
    }
  };

  const handleDeletePerson = async (person: PersonItem) => {
    const performDelete = async () => {
      try {
        setDeletingPersonId(person.id);
        await deletePersonMutation.mutateAsync({
          id: person.id,
          listId: id, // Pass the listId to help the mutation update the correct list
        });
      } catch (error) {
        console.error('Failed to delete person:', error);
      } finally {
        setDeletingPersonId(null);
      }
    };

    if (Platform.OS === 'web') {
      if (
        !confirm(
          `Are you sure you want to delete ${person.firstName} ${person.lastName}?`
        )
      ) {
        return;
      }
      performDelete();
    } else {
      Alert.alert(
        'Delete Person',
        `Are you sure you want to delete ${person.firstName} ${person.lastName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  const handleMovePerson = async (targetListId: string) => {
    if (!selectedPerson) return;

    try {
      await updatePersonMutation.mutateAsync({
        id: selectedPerson.id,
        listId: targetListId,
        previousListId: id, // Add previous list ID for proper cache handling
        firstName: selectedPerson.firstName,
        lastName: selectedPerson.lastName,
        email: selectedPerson.email,
        phone: selectedPerson.phone,
        notes: selectedPerson.notes,
      });
      // Cache is updated by the hook
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

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={isWeb}
        >
          <View style={styles.detailsContainer}>
            <View style={[styles.compactHeader, { backgroundColor: backgroundColor }]}>
              <ListChecks size={24} color={iconColor} style={styles.compactIcon} />
              <View style={styles.compactHeaderText}>
                <ThemedText style={styles.compactListName}>{list.name}</ThemedText>
                {list.description ? (
                  <ThemedText style={styles.compactDescription}>
                    {list.description}
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.noDescription}>No description</ThemedText>
                )}
              </View>
            </View>

            <View
              style={[
                styles.panel,
                styles.addPersonPanel,
                { backgroundColor: cardBackground },
              ]}
            >
              {isWeb ? (
                <AddPersonInlineForm
                  onSubmit={handleAddPerson}
                  isSubmitting={createPersonMutation.status === 'pending'}
                />
              ) : (
                <View style={styles.buttonWrapper}>
                  <UserPlus size={16} color="#0066ff" style={styles.buttonIcon} />
                  <Button
                    style={styles.mobileActionButton}
                    onPress={() => setAddPersonModalVisible(true)}
                  >
                    Add Person
                  </Button>
                </View>
              )}
            </View>

            {/* People List Section */}
            <View
              style={[
                styles.panel,
                styles.peoplePanel,
                { backgroundColor: cardBackground },
              ]}
            >
              <ThemedText style={styles.panelTitle}>People in {list.name}</ThemedText>

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
              ) : isWeb ? (
                <PersonGrid
                  people={people}
                  onEditPerson={(person) => {
                    setSelectedPerson(person);
                    setEditPersonModalVisible(true);
                  }}
                  onDeletePerson={handleDeletePerson}
                  onMovePerson={(person) => {
                    setSelectedPerson(person);
                    setMovePersonModalVisible(true);
                  }}
                  deletingPersonId={deletingPersonId}
                />
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
        </ScrollView>

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
    paddingTop: 24,
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
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  detailsContainer: {
    maxWidth: isWeb ? 1200 : 400,
    width: '100%',
    alignSelf: 'center',
  },
  // Compact header styles
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  compactHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  compactIcon: {
    marginRight: 12,
  },
  compactHeaderText: {
    flex: 1,
  },
  compactListName: {
    fontSize: 18,
    fontWeight: '600',
  },
  compactDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  noDescription: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Panel styles
  panel: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addPersonPanel: {
    marginBottom: 24,
  },
  peoplePanel: {
    paddingBottom: 24,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  // Inline form styles
  inlineForm: {
    width: '100%',
  },
  inlineFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inlineFormRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inlineFormField: {
    flex: 1,
  },
  inlineInput: {
    width: '100%',
  },
  notesInput: {
    marginBottom: 12,
  },
  inlineButton: {
    marginTop: 8,
  },
  // Grid styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  gridCard: {
    borderRadius: 8,
    padding: 16,
    height: '100%',
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  personDetail: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  personActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  deleteIconButton: {
    backgroundColor: '#ff3b30',
  },
  deletingIconButton: {
    backgroundColor: '#ff3b30',
    opacity: 0.7,
  },
  spinnerContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
    opacity: 0.8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  actionIcon: {
    marginRight: 6,
  },
  deleteText: {
    color: '#ffffff',
  },
  deleteIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  // Other styles still needed
  iconContainer: {
    marginRight: 12,
  },
  peopleList: {
    flex: 1,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
    position: 'relative',
    zIndex: 1,
  },
  mobileActionButton: {
    flex: 1,
  },
  // Skeleton styles
  skeletonPanel: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  skeleton: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonTitle: {
    height: 20,
    width: 200,
  },
  skeletonDescription: {
    height: 16,
    width: 250,
    marginLeft: 12,
  },
  loadingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066ff',
    marginLeft: 8,
  },
});
