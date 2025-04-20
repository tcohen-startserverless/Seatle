import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useThemeColor } from '@/theme';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { useCreateList } from '@/api/hooks/lists';
import { TextInput } from '@/components/TextInput';
import { useForm } from '@tanstack/react-form';
import * as v from 'valibot';

export default function CreateListScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(800, screenWidth - 32);
  const createMutation = useCreateList();
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          name: value.name.trim(),
          description: value.description?.trim() || undefined,
        });
        router.push('/lists');
      } catch (error) {
        console.error('Failed to create list:', error);
      }
    },
  });
  
  const isSubmitting = createMutation.status === 'pending' || form.state.isSubmitting;

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
          <form.Field
            name="name"
            validators={{
              onChange: (field) => {
                if (!field.value?.trim()) {
                  return 'Name is required'
                }
                return undefined
              }
            }}
          >
            {(field) => (
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Name</ThemedText>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter list name"
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

          <form.Field
            name="description"
          >
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

          <Button 
            onPress={() => form.handleSubmit()} 
            style={styles.button} 
            isLoading={isSubmitting}
            disabled={!form.state.canSubmit}
          >
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
