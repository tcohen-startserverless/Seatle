import { hc } from 'hono/client';
import type { App } from '@functions/api';

if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not defined');
}

export const client = hc<App>(process.env.EXPO_PUBLIC_API_URL);
