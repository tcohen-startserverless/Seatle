import { Modal, StyleSheet, View, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useThemeColor } from '@/theme';
import { useForm } from '@tanstack/react-form';
import { useAuth } from '@/hooks/useAuth';
import { useListLists } from '@/api/hooks/lists';
import { useCreateChart } from '@/api/hooks/charts';
import { X } from 'lucide-react';

interface CreateChartModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateChartModal({ visible, onClose }: CreateChartModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'text');

  // Fetch available lists
  const { data: listsData } = useListLists();
  const createChartMutation = useCreateChart();

  const [selectedListId, setSelectedListId] = useState<string>('');

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      if (!user?.id) {
        Alert.alert('Error', 'You must be logged in to create a chart');
        return;
      }

      if (!value.name.trim()) {
        Alert.alert('Error', 'Please enter a chart name');
        return;
      }

      if (!selectedListId) {
        Alert.alert('Error', 'Please select a list');
        return;
      }

      try {
        const chart = await createChartMutation.mutateAsync({
          name: value.name.trim(),
          description: value.description?.trim() || undefined,
          listId: selectedListId,
        });

        form.reset();
        setSelectedListId('');
        onClose();

        router.push(`/charts/${chart.chartId}`);
      } catch (error) {
        console.error('Error creating chart:', error);
        Alert.alert('Error', 'Failed to create chart');
      }
    },
  });

  const isSubmitting = createChartMutation.isPending || form.state.isSubmitting;

  const selectList = (listId: string) => {
    setSelectedListId(listId);
  };

  const handleClose = () => {
    form.reset();
    setSelectedListId('');
    onClose();
  };

  // Render list selection options
  const renderListOptions = () => {
    if (!listsData?.data || listsData.data.length === 0) {
      return <ThemedText style={styles.emptyText}>No lists available</ThemedText>;
    }

    return (
      <View style={styles.listContainer}>
        {listsData.data.map((list) => {
          const isSelected = selectedListId === list.id;
          return (
            <Pressable
              key={list.id}
              style={[
                styles.listItem,
                {
                  borderColor,
                  backgroundColor: isSelected ? tintColor : 'transparent',
                },
              ]}
              onPress={() => selectList(list.id)}
            >
              <ThemedText
                style={isSelected ? { color: '#ffffff', fontWeight: 'bold' } : undefined}
              >
                {list.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">Create New Chart</ThemedText>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={iconColor} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              <form.Field name="name">
                {(field) => (
                  <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Name</ThemedText>
                    <TextInput
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      placeholder="Enter chart name"
                      style={styles.input}
                      autoFocus
                    />
                    {field.state.meta.errors.length > 0 && field.state.meta.isTouched ? (
                      <ThemedText style={styles.errorText}>
                        {field.state.meta.errors[0]}
                      </ThemedText>
                    ) : null}
                  </View>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Description (optional)</ThemedText>
                    <TextInput
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      placeholder="Enter description"
                      style={styles.input}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                )}
              </form.Field>

              <View style={styles.formGroup}>
                <ThemedText style={styles.sectionLabel}>Associated List</ThemedText>
                {renderListOptions()}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              onPress={() => form.handleSubmit()}
              disabled={!form.state.canSubmit || isSubmitting}
              isLoading={isSubmitting}
              style={styles.createButton}
            >
              Create Chart
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    marginBottom: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 14,
    padding: 20,
  },
  createButton: {
    width: '100%',
  },
});
