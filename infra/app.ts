import { api } from './api';
import { auth } from './auth';
import { domain } from './domain';

// export const mobile = new sst.x.DevCommand('expo', {
//   dev: {
//     command: 'bun run start',
//     directory: 'packages/frontend',
//     autostart: true,
//     title: 'Seater App',
//   },
//   environment: {
//     EXPO_PUBLIC_API_URL: api.url,
//     EXPO_PUBLIC_AUTH_URL: auth.url,
//   },
// });

export const web = new sst.aws.StaticSite('Web', {
  domain: $app.stage === 'production' ? domain : undefined,
  dev: {
    autostart: true,
    command: 'bun run web',
    directory: 'packages/frontend',
    title: 'Seatle Web',
  },
  path: 'packages/frontend',
  build: {
    command: 'bun run build:web',
    output: 'dist',
  },
  environment: {
    EXPO_PUBLIC_API_URL: api.url,
    EXPO_PUBLIC_AUTH_URL: auth.url,
  },
});
