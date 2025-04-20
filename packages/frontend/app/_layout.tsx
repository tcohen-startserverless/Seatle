import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApiClientProvider } from '@/api';
import { queryClient } from '@/api/queryClient';
import { ThemeProvider } from '@/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
              <Stack.Screen name="callback" options={{ title: 'Authenticating...' }} />
            </Stack>
          </AuthProvider>
        </ApiClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
