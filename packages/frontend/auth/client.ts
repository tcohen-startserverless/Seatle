import { createClient } from '@openauthjs/openauth/client';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subjects, subjects } from '@core/auth';

export const openAuthClient = createClient({
  clientID: 'seater-mobile',
  issuer: process.env.EXPO_PUBLIC_AUTH_URL,
});

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const CHALLENGE_KEY = 'auth_challenge';

const Storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const AuthStorage = {
  async storeTokens(tokens: { access: string; refresh: string }) {
    await Promise.all([
      Storage.setItem(ACCESS_TOKEN_KEY, tokens.access),
      Storage.setItem(REFRESH_TOKEN_KEY, tokens.refresh),
    ]);
  },

  async getTokens() {
    const [access, refresh] = await Promise.all([
      Storage.getItem(ACCESS_TOKEN_KEY),
      Storage.getItem(REFRESH_TOKEN_KEY),
    ]);
    return { access, refresh };
  },

  async storeChallenge(challenge: any) {
    await Storage.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
  },

  async getChallenge() {
    const challenge = await Storage.getItem(CHALLENGE_KEY);
    return challenge ? JSON.parse(challenge) : null;
  },

  async clearChallenge() {
    await Storage.removeItem(CHALLENGE_KEY);
  },

  async clearAuth() {
    await Promise.all([
      Storage.removeItem(ACCESS_TOKEN_KEY),
      Storage.removeItem(REFRESH_TOKEN_KEY),
      Storage.removeItem(CHALLENGE_KEY),
    ]);
  },
};

export async function getCurrentUser() {
  const { access, refresh } = await AuthStorage.getTokens();

  if (!access) return null;

  try {
    const verified = await openAuthClient.verify(subjects, access, {
      refresh: refresh || undefined,
    });

    if (verified.err) {
      console.log('Token verification failed:', verified.err);
      return null;
    }

    // If tokens were refreshed, store the new ones
    if (verified.tokens) {
      await AuthStorage.storeTokens(verified.tokens);
    }

    if (verified.subject.type === 'user' && verified.subject.properties) {
      return verified.subject.properties as UserSubject;
    }

    return null;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
