import { hc } from 'hono/client';
import type { App } from '@functions/api';
// import { createClient } from '@openauthjs/openauth';

export const client = hc<App>(process.env.EXPO_PUBLIC_API_URL);
// export const authClient = createClient({
//   clientID: '',
//   issuer: '',
// });
