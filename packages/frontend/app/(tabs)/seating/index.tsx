import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Plus, Grid } from 'lucide-react';
import { useListSeating } from '@/hooks/seating';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function SeatingScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');

  const schoolId = '123';
  const classId = '456';

  const { data: seatingList, isLoading, error } = useListSeating({ schoolId, classId });

  const handleCreateNew = () => {
    router.push('/seating/create');
  };

  const handleViewChart = (id: string) => {
    router.push(`/seating/${id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Grid size={64} color={iconColor} opacity={0.3} />
      <ThemedText style={styles.emptyStateTitle}>No Seating Charts Yet</ThemedText>
      <ThemedText style={styles.emptyStateDescription}>
        Create your first seating chart to arrange your classroom
      </ThemedText>
      <Button onPress={handleCreateNew} icon={<Plus size={20} color="white" />}>
        Create New Chart
      </Button>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card} onPress={() => handleViewChart(item.id)}>
      <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
      <ThemedText style={styles.cardDetails}>
        {item.rows}x{item.columns} grid
      </ThemedText>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Seating Charts</ThemedText>
        <Button onPress={handleCreateNew} icon={<Plus size={20} color="white" />}>
          Create New
        </Button>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ThemedText>Loading seating charts...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <ThemedText>Error loading seating charts</ThemedText>
        </View>
      ) : seatingList?.data?.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={seatingList?.data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  listContent: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
