import {
  StyleSheet,
  View,
  useWindowDimensions,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { useListCharts } from '@/api/hooks/charts';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FAB } from '@/components/ui/FAB';
import { CreateChartModal } from '@/components/modals/CreateChartModal';

const ChartsList = () => {
  const router = useRouter();
  const { data: chartsData, isLoading, error } = useListCharts();
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={tintColor} />
        <ThemedText>Loading charts...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Error loading charts</ThemedText>
      </View>
    );
  }

  if (!chartsData?.data || !chartsData.data?.length) {
    return <ThemedText>No charts created yet</ThemedText>;
  }

  return (
    <View style={styles.chartsContainer}>
      {chartsData.data.map((chart) => (
        <Pressable
          key={chart.chartId}
          style={[styles.chartItem, { borderColor }]}
          onPress={() => router.push(`/charts/${chart.chartId}`)}
        >
          <View style={styles.chartItemContent}>
            <ThemedText style={styles.chartName}>{chart.name}</ThemedText>
            {chart.description && (
              <ThemedText numberOfLines={2} style={styles.chartDescription}>
                {chart.description}
              </ThemedText>
            )}
          </View>
          <ExternalLink size={18} color={tintColor} />
        </Pressable>
      ))}
    </View>
  );
};

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
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  errorContainer: {
    padding: 16,
  },
  chartsContainer: {
    gap: 12,
    marginTop: 8,
  },
  chartItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartItemContent: {
    flex: 1,
    marginRight: 12,
  },
  chartName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chartDescription: {
    fontSize: 14,
    opacity: 0.7,
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
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  chartList: {
    marginBottom: 32,
  },
  errorText: {
    color: '#FF3B30',
  },
});

export default function ChartsScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentPadding = 16;
  const availableWidth = screenWidth - insets.left - insets.right - contentPadding * 2;
  const contentWidth = Math.min(800, availableWidth);
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const [createModalVisible, setCreateModalVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.header}>
          <ThemedText type="title">Charts</ThemedText>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.chartList}>
            <ThemedText type="subtitle">Your Charts</ThemedText>
            <ChartsList />
          </View>
        </ScrollView>
      </View>

      <FAB onPress={() => setCreateModalVisible(true)} />

      <CreateChartModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </ThemedView>
  );
}
