import { hc } from 'hono/client';
import type { App } from '@functions/api';
import { AuthStorage } from './auth/client';

const tokens = AuthStorage.getTokens();
export const client = hc<App>(process.env.EXPO_PUBLIC_API_URL, {
  headers: {
    Authorization: `Bearer ${tokens.access_token}`,
  },
});
