import { useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { openAuthClient, AuthStorage } from '@/auth/client';

export default function CallbackScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams();
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!code) {
          router.replace({ pathname: '/auth/login', params: { error: 'no_code' } });
          return;
        }

        const challenge = await AuthStorage.getChallenge();
        const redirectUri = 'seater://callback';

        const exchanged = await openAuthClient.exchange(
          code,
          redirectUri,
          challenge?.verifier
        );

        if (exchanged.err) {
          console.error('Exchange error:', exchanged.err);
          router.replace({
            pathname: '/auth/login',
            params: { error: 'exchange_failed' },
          });
          return;
        }

        await AuthStorage.storeTokens(exchanged.tokens);
        router.replace({ pathname: '/(tabs)' });
      } catch (error) {
        console.error('Callback error:', error);
        router.replace({ pathname: '/auth/login', params: { error: 'callback_failed' } });
      }
    };

    handleCallback();
  }, [code, router]);

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={tintColor} />
      <ThemedText style={styles.text}>Completing login...</ThemedText>
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
  text: {
    marginTop: 20,
  },
});
