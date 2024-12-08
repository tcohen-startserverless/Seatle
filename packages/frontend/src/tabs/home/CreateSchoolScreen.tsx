import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useCreateSchool } from '@frontend/hooks/school';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  CreateSchool: undefined;
};

type CreateSchoolScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateSchool'>;
type CreateSchoolScreenRouteProp = RouteProp<RootStackParamList, 'CreateSchool'>;

type Props = {
  navigation: CreateSchoolScreenNavigationProp;
  route: CreateSchoolScreenRouteProp;
};

const CreateSchoolScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const createSchoolMutation = useCreateSchool();

  const handleSubmit = () => {
    createSchoolMutation.mutate(
      {
        name,
        address,
        city,
        state,
        zipCode,
        phone,
        status: 'ACTIVE',
      },
      {
        onSuccess: () => {
          navigation.navigate('Home');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />
      <TextInput
        style={styles.input}
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={setZipCode}
      />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      <Button title="Create School" onPress={handleSubmit} />
      {createSchoolMutation.isLoading && <Text>Creating school...</Text>}
      {createSchoolMutation.isError && <Text>Error creating school</Text>}
      {createSchoolMutation.isSuccess && <Text>School created successfully!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default CreateSchoolScreen;
