import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft } from 'lucide-react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { useState, useEffect } from 'react';
import { useGetChart } from '@/api/hooks/charts';
import { TablePosition } from '@/components/FloorPlanEditor/types';

export default function ChartDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(800, screenWidth - 32);
  const [tables, setTables] = useState<TablePosition[]>([]);

  const { data: chart, isLoading } = useGetChart({ id: id ?? '' });

  useEffect(() => {
    if (chart?.items) {
      // Convert chart items to TablePosition format
      const tableItems = chart.items
        .filter(item => item.type === 'TABLE')
        .map(item => ({
          id: item.id,
          x: item.x,
          y: item.y,
          size: item.size || item.width, // Use size or width depending on what's available
          cells: item.cells || 1,
        }));
      
      setTables(tableItems);
    }
  }, [chart]);

  if (isLoading || !id) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!chart) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Chart not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/charts')} style={styles.backButton}>
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <ThemedText type="title">{chart.name}</ThemedText>
        </View>
        
        <View style={styles.chartContainer}>
          <FloorPlanEditor 
            tables={tables} 
            onTableUpdate={setTables} 
            editable={false}
            edgePadding={32} 
          />
        </View>

        {chart.description && (
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle">Description</ThemedText>
            <ThemedText>{chart.description}</ThemedText>
          </View>
        )}

        {chart.lists && chart.lists.length > 0 && (
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle">Associated Lists</ThemedText>
            {chart.lists.map((list) => (
              <Pressable 
                key={list.id} 
                style={[styles.listItem, { borderColor }]}
                onPress={() => router.push(`/lists/${list.id}`)}
              >
                <ThemedText>{list.name}</ThemedText>
              </Pressable>
            ))}
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    padding: 8,
  },
  chartContainer: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  sectionContainer: {
    marginTop: 24,
    gap: 8,
  },
  listItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 4,
  },
});