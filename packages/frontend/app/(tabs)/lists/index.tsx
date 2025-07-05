import { StyleSheet, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FAB } from '@/components/ui/FAB';
import { useListLists } from '@/api/hooks/lists';
import { ListChecks } from 'lucide-react';
import { useReactiveThemeColor, useSpacing, useRadius } from '@/theme';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useResponsiveStyles } from '@/hooks/useResponsiveStyles';
import { TouchTarget } from '@/components/adaptive/TouchTarget';
import { AdaptiveGrid } from '@/components/adaptive/AdaptiveGrid';

function ListsSkeleton({ contentWidth }: { contentWidth: number }) {
  const skeletonColor = useReactiveThemeColor({}, 'border');
  const cardBackground = useReactiveThemeColor({}, 'card');

  const skeletonItems = new Array(3).fill(0);

  return (
    <View style={[styles.content, { width: contentWidth }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.skeleton,
            styles.skeletonTitle,
            { backgroundColor: skeletonColor },
          ]}
        />
      </View>

      {skeletonItems.map((_, index) => (
        <View key={index} style={[styles.card, { backgroundColor: cardBackground }]}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.skeleton,
                styles.skeletonIcon,
                { backgroundColor: skeletonColor },
              ]}
            />
            <View
              style={[
                styles.skeleton,
                styles.skeletonCardTitle,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>
          <View
            style={[
              styles.skeleton,
              styles.skeletonCardDescription,
              { backgroundColor: skeletonColor, marginLeft: 36 },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

// Helper to determine if we're on web platform
const isWeb = Platform.OS === 'web';

// UX-optimized list card component
function ListCard({
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
  const { text, size, layout, space } = useResponsiveStyles();
  const spacing = useSpacing();

  return (
    <TouchTarget
      onPress={onPress}
      variant="secondary"
      feedback="scale"
      size="small"
      accessibilityLabel={`Open list ${item.name}`}
      accessibilityRole="button"
      accessibilityHint={
        item.description ? `List description: ${item.description}` : 'Open this list'
      }
      style={
        [
          styles.card,
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
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <ListChecks
            size={size.icon('card')}
            color={iconColor}
            style={styles.cardIcon}
          />
        </View>
        <View style={styles.titleContainer}>
          <ThemedText
            style={[styles.cardTitle, text.size('title'), text.weight('semibold')]}
          >
            {item.name}
          </ThemedText>
          {item.description && (
            <ThemedText style={[styles.cardDescription, text.size('body')]}>
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

export default function ListsScreen() {
  const router = useRouter();
  const spacing = useSpacing();
  const insets = useSafeAreaInsets();
  const { touchFirst, gridColumns, touchTargets, density, contentWidth, availableWidth } =
    useAdaptiveDesign();
  const { text, size, layout } = useResponsiveStyles();
  const iconColor = useReactiveThemeColor({}, 'text');
  const cardBackground = useReactiveThemeColor({}, 'card');
  const borderColor = useReactiveThemeColor({}, 'border');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const { data, isLoading, error, isFetching } = useListLists();

  useEffect(() => {
    if (isFirstLoad && !isLoading) {
      setIsFirstLoad(false);
    }
  }, [isLoading]);

  if (isLoading && isFirstLoad) {
    return (
      <ThemedView style={styles.container}>
        <ListsSkeleton contentWidth={Math.min(contentWidth, availableWidth - 32)} />
        <FAB onPress={() => router.push('/lists/create')} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={[styles.content, { width: Math.min(contentWidth, availableWidth - 32) }]}
        >
          <View style={styles.header}>
            <ThemedText type="title">Lists</ThemedText>
          </View>
          <ThemedText>Error loading lists</ThemedText>

          <FAB onPress={() => router.push('/lists/create')} />
        </View>
      </ThemedView>
    );
  }

  // UX-optimized list rendering with adaptive grid
  const renderList = () => {
    const lists = data?.data || [];

    if (lists.length === 0) {
      return (
        <View style={[styles.emptyState, { paddingVertical: spacing.xl }]}>
          <ListChecks
            size={size.icon('large') * 2}
            color={iconColor}
            style={{ opacity: 0.3, marginBottom: spacing.md }}
          />
          <ThemedText
            style={[styles.emptyText, text.size('heading'), { marginBottom: spacing.sm }]}
          >
            No lists found
          </ThemedText>
          <ThemedText style={[styles.emptySubtext, text.size('body')]}>
            Create your first list to get started
          </ThemedText>
        </View>
      );
    }

    return (
      <AdaptiveGrid
        key={`lists-grid-${Math.floor(contentWidth / 50)}`}
        data={lists}
        renderItem={({ item, isGrid }) => (
          <ListCard
            item={item}
            onPress={() => router.push(`/lists/${item.id}`)}
            iconColor={iconColor}
            cardBackground={cardBackground}
            borderColor={borderColor}
            isGrid={isGrid}
          />
        )}
        keyExtractor={(item: any) => item.id}
        maxColumns={12}
        spacing={spacing.sm}
        contentPadding={16}
        availableWidth={Math.min(contentWidth, availableWidth - 32)}
        // Performance optimizations
        removeClippedSubviews={!touchFirst}
        maxToRenderPerBatch={touchFirst ? 8 : 12}
        // Accessibility
        accessibilityLabel="Lists grid"
        // Empty state
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No lists found</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Create your first list to get started
            </ThemedText>
          </View>
        )}
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
            Lists
          </ThemedText>
          {isFetching && (
            <View style={[styles.loadingIndicator, { backgroundColor: iconColor }]} />
          )}
        </View>

        {renderList()}

        <FAB onPress={() => router.push('/lists/create')} />
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
  card: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
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
  cardIcon: {
    opacity: 0.8,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingRight: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 1,
  },
  cardDescription: {
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
  skeleton: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonTitle: {
    height: 28,
    width: 120,
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  skeletonCardTitle: {
    height: 20,
    width: 180,
  },
  skeletonCardDescription: {
    height: 16,
    width: 240,
    marginTop: 8,
  },
  loadingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    opacity: 0.6,
  },
});
