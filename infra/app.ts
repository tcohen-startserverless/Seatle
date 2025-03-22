import { api } from './api';
import { authApi } from './auth';

export const mobile = new sst.x.DevCommand('expo', {
  dev: {
    command: 'bun run start',
    directory: 'packages/frontend',
    autostart: true,
    title: 'Seater App',
  },
  link: [api],
  environment: {
    EXPO_PUBLIC_API_URL: api.url,
    EXPO_PUBLIC_AUTH_URL: authApi.url,
  },
});

// export const web = new sst.aws.StaticSite("Web", {
//   build: {
//     command: "npx expo export:web",
//     output: "web-build",
//   },
//   environment: {
//     EXPO_PUBLIC_API_URL: myApi.url,
//   },
// });
