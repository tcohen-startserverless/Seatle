import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StudentForm } from '@/components/forms/StudentForm';
import { PersonSchema } from '@core/person';
import { ArrowLeft } from 'lucide-react';

export default function CreateStudentScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(800, screenWidth - 32);
  // const createMutation = useCreateStudent();

  const handleCreateStudent = async (values: PersonSchema.Types.Create) => {
    try {
      // await createMutation.mutateAsync(values);
      router.back();
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/students')} style={styles.backButton}>
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <ThemedText type="title">Add Student</ThemedText>
        </View>
        <StudentForm
          onSubmit={handleCreateStudent}
          // isSubmitting={createMutation.isLoading}
        />
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
});
