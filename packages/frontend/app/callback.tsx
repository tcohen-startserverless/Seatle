import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { notifyAuthChange } from '@/hooks/useAuth';
import { openAuthClient, AuthStorage } from '@/auth/client';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function CallbackScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) throw new Error('No code parameter found in redirect URL');

        const challenge = await AuthStorage.getChallenge();
        if (!challenge) throw new Error('No stored challenge found');

        const origin = window.location.origin;
        const redirectUri = `${origin}/callback`;
        const exchanged = await openAuthClient.exchange(
          code,
          redirectUri,
          challenge.verifier
        );

        if (exchanged.err)
          throw new Error(`Token exchange failed: ${exchanged.err.message}`);
        console.log('Token exchange successful');
        await AuthStorage.storeTokens(exchanged.tokens);
        await AuthStorage.clearChallenge();
        notifyAuthChange();
        router.replace('/');
      } catch (err) {
        console.error('Error handling callback:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };
    handleCallback();
  }, [router]);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
    >
      {error ? (
        <View>
          <ThemedText style={{ color: 'red', marginBottom: 20, textAlign: 'center' }}>
            {error}
          </ThemedText>
          <ThemedText
            style={{ color: 'blue', textDecorationLine: 'underline' }}
            onPress={() => router.replace('/auth/login')}
          >
            Return to login
          </ThemedText>
        </View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={{ marginTop: 20 }}>Completing login...</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}
