import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ApiClientProvider } from '@/api';
import { QueryPersistenceProvider } from '@/api/QueryPersistenceProvider';
import { ThemeProvider } from '@/theme';
import RestoreLoadingIndicator from '@/components/RestoreLoadingIndicator';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryPersistenceProvider>
        <ApiClientProvider>
          <AuthProvider>
            <>
              <RestoreLoadingIndicator />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
                <Stack.Screen name="callback" options={{ title: 'Authenticating...' }} />
              </Stack>
            </>
          </AuthProvider>
        </ApiClientProvider>
      </QueryPersistenceProvider>
    </ThemeProvider>
  );
}
