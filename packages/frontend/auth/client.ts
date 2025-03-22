import { createClient } from '@openauthjs/openauth/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subjects } from '@core/auth';

export const openAuthClient = createClient({
  clientID: 'seater-web',
  issuer: process.env.EXPO_PUBLIC_AUTH_URL,
});

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const CHALLENGE_KEY = 'auth_challenge';

const Storage = {
  async setItem(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  },

  async getItem(key: string) {
    return await AsyncStorage.getItem(key);
  },

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  },
};

export const AuthStorage = {
  async storeTokens(tokens: { access: string; refresh: string }) {
    console.log('Storing auth tokens');
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
    console.log('Storing PKCE challenge');
    await Storage.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
  },

  async getChallenge() {
    const challenge = await Storage.getItem(CHALLENGE_KEY);
    const parsed = challenge ? JSON.parse(challenge) : null;
    console.log('Retrieved challenge:', parsed ? 'found' : 'not found');
    return parsed;
  },

  async clearChallenge() {
    console.log('Clearing PKCE challenge');
    await Storage.removeItem(CHALLENGE_KEY);
  },

  async clearAuth() {
    console.log('Clearing all auth data');
    await Promise.all([
      Storage.removeItem(ACCESS_TOKEN_KEY),
      Storage.removeItem(REFRESH_TOKEN_KEY),
      Storage.removeItem(CHALLENGE_KEY),
    ]);
  },
};

export type UserSubject = {
  id: string;
  email: string;
  role?: string;
};

export async function getCurrentUser(): Promise<UserSubject | null> {
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
