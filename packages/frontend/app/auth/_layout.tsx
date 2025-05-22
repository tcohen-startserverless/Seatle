import React from 'react';
import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
