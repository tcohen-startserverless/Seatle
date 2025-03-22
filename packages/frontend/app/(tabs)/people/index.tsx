import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { PeopleList } from '@/components/ui/PeopleList';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function PeopleScreen() {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(800, width - 32);
  const { data, isLoading, error } = { data: [], isLoading: false, error: null };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error loading students</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <PeopleList people={data?.pages[0]?.data ?? []} />
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
});
