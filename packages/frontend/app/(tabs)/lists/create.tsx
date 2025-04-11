import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { useCreateList } from '@/api/hooks/lists';
import { TextInput } from '@/components/TextInput';

export default function CreateListScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(800, screenWidth - 32);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const createMutation = useCreateList();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    setNameError('');

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      router.push('/lists');
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  const isSubmitting = createMutation.status === 'pending';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <ThemedText type="title">Create List</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter list name"
              style={styles.input}
              autoFocus
            />
            {nameError ? (
              <ThemedText style={styles.errorText}>{nameError}</ThemedText>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Description (optional)</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </View>

          <Button onPress={handleSubmit} style={styles.button} isLoading={isSubmitting}>
            Create List
          </Button>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    padding: 8,
  },
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
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
  button: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
