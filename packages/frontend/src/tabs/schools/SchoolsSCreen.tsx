import React from 'react';
import { View, Button, Text, FlatList, StyleSheet } from 'react-native';
import { useSchools } from '@frontend/hooks/school';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Schools: undefined;
  CreateSchool: undefined;
};

type SchoolsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Schools'
>;
type SchoolsScreenRouteProp = RouteProp<RootStackParamList, 'Schools'>;

type Props = {
  navigation: SchoolsScreenNavigationProp;
  route: SchoolsScreenRouteProp;
};

const SchoolsScreen: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, isError } = useSchools();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading schools</Text>;
  }

  const schools = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <View style={styles.container}>
      <Button
        title="Create School"
        onPress={() => navigation.navigate('CreateSchool')}
      />
      <FlatList
        data={schools}
        keyExtractor={(item) => item.schoolId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>
              {item.city}, {item.state} {item.zipCode}
            </Text>
            <Text>{item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SchoolsScreen;
