import { useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { StudentItem } from '@core/student';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FAB } from '@/components/ui/FAB';

export interface StudentListProps {
  students: StudentItem[];
  width?: number;
}

export function StudentList({ students, width: propWidth }: StudentListProps) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const listWidth = propWidth ?? Math.min(800, screenWidth - 32);
  const backgroundColor = useThemeColor({}, 'primaryRow');
  const alternateBackground = useThemeColor({}, 'alternateRow');

  const handlePersonPress = useCallback(
    (personId: string) => {
      router.push(`/student/${personId}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: StudentItem; index: number }) => (
      <View style={styles.itemWrapper}>
        <Pressable
          style={[
            styles.personItem,
            {
              backgroundColor:
                index % 2 === 0 ? backgroundColor : alternateBackground,
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
          <ThemedText type="title">Students</ThemedText>
        </View>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: listWidth }}
        data={students}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <View style={[styles.fabWrapper, { width: listWidth }]}>
        <View style={styles.fabContainer}>
          <FAB onPress={() => router.push('/students/create')} />
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
