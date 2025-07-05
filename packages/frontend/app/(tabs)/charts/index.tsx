import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useReactiveThemeColor, useSpacing } from '@/theme';
import { useListCharts } from '@/api/hooks/charts';
import { Grid, Plus } from 'lucide-react';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FAB } from '@/components/ui/FAB';
import { CreateChartModal } from '@/components/modals/CreateChartModal';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useResponsiveStyles } from '@/hooks/useResponsiveStyles';
import { TouchTarget } from '@/components/adaptive/TouchTarget';
import { AdaptiveGrid } from '@/components/adaptive/AdaptiveGrid';
import { AdaptivePanel } from '@/components/adaptive/AdaptivePanel';

// UX-optimized chart card component
function ChartCard({
  item,
  onPress,
  iconColor,
  cardBackground,
  borderColor,
  isGrid,
}: {
  item: any;
  onPress: () => void;
  iconColor: string;
  cardBackground: string;
  borderColor: string;
  isGrid: boolean;
}) {
  const { touchFirst, touchTargets } = useAdaptiveDesign();
  const { text, size, layout } = useResponsiveStyles();
  const spacing = useSpacing();

  return (
    <TouchTarget
      onPress={onPress}
      variant="secondary"
      feedback="scale"
      size="small"
      accessibilityLabel={`Open chart ${item.name}`}
      accessibilityRole="button"
      accessibilityHint={
        item.description ? `Chart description: ${item.description}` : 'Open this chart'
      }
      style={
        [
          styles.chartCard,
          layout.card,
          {
            backgroundColor: cardBackground,
            minHeight: touchTargets.min,
            marginBottom: isGrid ? 0 : spacing.sm,
            // Enhanced visual styling
            borderWidth: 1,
            borderColor: borderColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          },
        ] as any
      }
    >
      <View style={styles.chartCardHeader}>
        <View style={styles.iconContainer}>
          <Grid size={size.icon('card')} color={iconColor} style={styles.chartCardIcon} />
        </View>
        <View style={styles.titleContainer}>
          <ThemedText
            style={[styles.chartCardTitle, text.size('title'), text.weight('semibold')]}
          >
            {item.name}
          </ThemedText>
          {item.description && (
            <ThemedText style={[styles.chartCardDescription, text.size('body')]}>
              {item.description}
            </ThemedText>
          )}
        </View>
        <View style={styles.chevronContainer}>
          <ThemedText style={styles.chevron}>›</ThemedText>
        </View>
      </View>
    </TouchTarget>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    maxWidth: '100%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
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
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
  chartCard: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minHeight: 48,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  chartCardIcon: {
    opacity: 0.8,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingRight: 6,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 1,
  },
  chartCardDescription: {
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 14,
    marginTop: 0,
  },
  chevronContainer: {
    width: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  chevron: {
    fontSize: 16,
    opacity: 0.4,
    fontWeight: '300',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    opacity: 0.6,
  },
});

export default function ChartsScreen() {
  const router = useRouter();
  const spacing = useSpacing();
  const insets = useSafeAreaInsets();
  const { touchFirst, gridColumns, touchTargets, density, contentWidth, availableWidth } =
    useAdaptiveDesign();
  const { text, size, layout } = useResponsiveStyles();
  const iconColor = useReactiveThemeColor({}, 'text');
  const cardBackground = useReactiveThemeColor({}, 'card');
  const borderColor = useReactiveThemeColor({}, 'border');
  const tintColor = useReactiveThemeColor({}, 'tint');

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { data: chartsData, isLoading, error, isFetching } = useListCharts();

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={[styles.content, { width: Math.min(contentWidth, availableWidth - 32) }]}
        >
          <View style={[styles.loadingContainer, { paddingVertical: spacing.xl }]}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText style={{ marginTop: spacing.md }}>Loading charts...</ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={[styles.content, { width: Math.min(contentWidth, availableWidth - 32) }]}
        >
          <View style={[styles.errorContainer, { paddingVertical: spacing.xl }]}>
            <ThemedText style={styles.errorText}>Error loading charts</ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  // UX-optimized chart rendering with adaptive grid
  const renderCharts = () => {
    const charts = chartsData?.data || [];

    if (charts.length === 0) {
      return (
        <View style={[styles.emptyState, { paddingVertical: spacing.xl }]}>
          <Grid
            size={size.icon('large') * 2}
            color={iconColor}
            style={{ opacity: 0.3, marginBottom: spacing.md }}
          />
          <ThemedText
            style={[styles.emptyText, text.size('heading'), { marginBottom: spacing.sm }]}
          >
            No charts found
          </ThemedText>
          <ThemedText style={[styles.emptySubtext, text.size('body')]}>
            Create your first chart to get started
          </ThemedText>
        </View>
      );
    }

    return (
      <AdaptiveGrid
        key={`charts-grid-${Math.floor(contentWidth / 50)}`}
        data={charts}
        renderItem={({ item, isGrid }) => (
          <ChartCard
            item={item}
            onPress={() => router.push(`/charts/${item.chartId}`)}
            iconColor={iconColor}
            cardBackground={cardBackground}
            borderColor={borderColor}
            isGrid={isGrid}
          />
        )}
        keyExtractor={(item: any) => item.chartId}
        maxColumns={12}
        spacing={spacing.sm}
        contentPadding={16}
        availableWidth={Math.min(contentWidth, availableWidth - 32)}
        // Performance optimizations
        removeClippedSubviews={!touchFirst}
        maxToRenderPerBatch={touchFirst ? 8 : 12}
        // Accessibility
        accessibilityLabel="Charts grid"
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[styles.content, { width: Math.min(contentWidth, availableWidth - 32) }]}
      >
        <View
          style={[
            styles.header,
            {
              marginTop: spacing.xs,
              marginBottom: spacing.lg,
              marginLeft: Math.max(insets.left, spacing.sm),
              marginRight: Math.max(insets.right, spacing.sm),
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            Charts
          </ThemedText>
          {isFetching && (
            <View style={[styles.loadingIndicator, { backgroundColor: iconColor }]} />
          )}
        </View>

        {renderCharts()}

        <FAB onPress={() => setCreateModalVisible(true)} />

        <AdaptivePanel
          isVisible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          title="Create Chart"
          variant="auto"
          enableBackdropDismiss
          accessibilityLabel="Create chart panel"
        >
          <CreateChartModal visible={true} onClose={() => setCreateModalVisible(false)} />
        </AdaptivePanel>
      </View>
    </ThemedView>
  );
}
