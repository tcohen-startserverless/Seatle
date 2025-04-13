import { Stack } from 'expo-router';

export default function ChartsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
