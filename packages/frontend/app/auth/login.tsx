import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LoginScreen() {
  const { login, isAuthenticated, isLoading, error } = useAuthContext();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    await login();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome to Seatle
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to manage your classroom seating charts
        </ThemedText>

        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error.message}</ThemedText>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={tintColor} />
          ) : (
            <Button
              onPress={handleLogin}
              icon={<Mail size={20} color="white" />}
              style={styles.loginButton}
            >
              Continue with Email
            </Button>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
  },
  loginButton: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
