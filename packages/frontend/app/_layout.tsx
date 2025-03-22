import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: "Login" }} />
        <Stack.Screen name="callback" options={{ title: "Authenticating..." }} />
      </Stack>
    </AuthProvider>
  );
}