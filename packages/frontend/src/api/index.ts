import { hc } from 'hono/client';
import type { App } from '@functions/api';

export const client = hc<App>(process.env.EXPO_PUBLIC_API_URL);
