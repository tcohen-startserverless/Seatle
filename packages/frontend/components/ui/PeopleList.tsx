import { useCallback } from 'react';
import { StyleSheet, FlatList, Pressable, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/theme';
import { FAB } from '@/components/ui/FAB';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PersonItem {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PeopleListProps {
  people: PersonItem[];
  width?: number;
}

export function PeopleList({ people, width: propWidth }: PeopleListProps) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const contentPadding = 16;
  const availableWidth = screenWidth - insets.left - insets.right - contentPadding * 2;
  const listWidth = propWidth ?? Math.min(800, availableWidth);
  const backgroundColor = theme.colors.primaryRow;
  const alternateBackground = theme.colors.alternateRow;

  const handlePersonPress = useCallback(
    (personId: string) => {
      router.push(`/People/${personId}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PersonItem; index: number }) => (
      <View style={styles.itemWrapper}>
        <Pressable
          style={[
            styles.personItem,
            {
              backgroundColor: index % 2 === 0 ? backgroundColor : alternateBackground,
            },
          ]}
          onPress={() => handlePersonPress(item.id)}
        >
          <View style={styles.personInfo}>
            <ThemedText type="subtitle">
              {item.firstName} {item.lastName}
            </ThemedText>
          </View>
        </Pressable>
      </View>
    ),
    [handlePersonPress, backgroundColor, alternateBackground]
  );

  const ListHeader = useCallback(
    () => (
      <View style={styles.itemWrapper}>
        <View style={styles.header}>
          <ThemedText type="title">People</ThemedText>
        </View>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: listWidth }}
        data={people}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <View style={[styles.fabWrapper, { width: listWidth }]}>
        <View style={styles.fabContainer}>
          <FAB onPress={() => router.push('/People/create')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  list: {
    padding: 16,
    width: '100%',
  },
  itemWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    maxWidth: 400,
    width: '100%',
  },
  personItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    maxWidth: 400,
  },
  personInfo: {
    gap: 4,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 16,
    alignItems: 'center',
  },
  fabContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'flex-end',
  },
});
