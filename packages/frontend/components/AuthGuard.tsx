import React, { ReactNode, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { ThemedView } from './ThemedView';
import { useTheme } from '@/theme';

type AuthGuardProps = {
  children: ReactNode;
  fallbackRoute?: string;
};

export function AuthGuard({ children, fallbackRoute = '/auth/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(fallbackRoute);
    }
  }, [isAuthenticated, isLoading, router, fallbackRoute]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </ThemedView>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});