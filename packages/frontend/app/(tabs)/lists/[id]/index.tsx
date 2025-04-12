import { StyleSheet, View, useWindowDimensions, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft, ListChecks } from 'lucide-react';
import { useGetList } from '@/api/hooks/lists';

function ListDetailSkeleton({
  contentWidth,
  iconColor,
  onBack,
}: {
  contentWidth: number;
  iconColor: string;
  onBack: () => void;
}) {
  const skeletonColor = useThemeColor({}, 'border');

  return (
    <View style={[styles.content, { width: contentWidth }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={iconColor} />
        </Pressable>
        <ThemedText type="title">List Details</ThemedText>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.iconContainer}>
          <ListChecks size={32} color={iconColor} />
        </View>

        <View style={styles.detailsContent}>
          <View
            style={[
              styles.skeleton,
              styles.skeletonTitle,
              { backgroundColor: skeletonColor },
            ]}
          />

          <View
            style={[
              styles.skeleton,
              styles.skeletonDescription,
              { backgroundColor: skeletonColor },
            ]}
          />

          <View style={[styles.emptyItems, { borderColor: skeletonColor, opacity: 0.6 }]}>
            <ThemedText style={styles.emptyText}>Loading items...</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const iconColor = useThemeColor({}, 'text');
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(800, screenWidth - 32);

  const { data: list, isFetching, error, isLoading } = useGetList({ id: id });

  const showSkeleton = isLoading || isFetching;

  if (showSkeleton) {
    return (
      <ThemedView style={styles.container}>
        <ListDetailSkeleton
          contentWidth={contentWidth}
          iconColor={iconColor}
          onBack={() => router.push('/lists')}
        />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">Error</ThemedText>
          </View>
          <ThemedText>Could not load list details</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!list && !isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">List Not Found</ThemedText>
          </View>
          <ThemedText>The requested list could not be found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!list) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <ThemedText type="title">List Not Found</ThemedText>
          </View>
          <ThemedText>The requested list could not be found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  // At this point list is guaranteed to be non-null
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <ThemedText type="title">List Details</ThemedText>
          {isFetching && <View style={styles.loadingIndicator} />}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.iconContainer}>
            <ListChecks size={32} color={iconColor} />
          </View>

          <View style={styles.detailsContent}>
            <ThemedText style={styles.listName}>{list.name}</ThemedText>

            {list.description ? (
              <ThemedText style={styles.description}>{list.description}</ThemedText>
            ) : (
              <ThemedText style={styles.noDescription}>No description</ThemedText>
            )}

            <View style={styles.emptyItems}>
              <ThemedText style={styles.emptyText}>No items in this list yet</ThemedText>
            </View>
          </View>
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
  detailsContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  detailsContent: {
    width: '100%',
  },
  listName: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  noDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  emptyItems: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  emptyText: {
    opacity: 0.6,
  },
  skeleton: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonTitle: {
    height: 24,
    width: '60%',
    alignSelf: 'center',
    marginBottom: 8,
  },
  skeletonDescription: {
    height: 16,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 24,
  },
  loadingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066ff',
    marginLeft: 8,
  },
});
