import { myApi } from './api';

export const mobile = new sst.x.DevCommand('expo', {
  dev: {
    command: 'bun run start',
    directory: 'packages/frontend',
    autostart: true,
  },
  link: [myApi],
  environment: {
    EXPO_PUBLIC_API_URL: myApi.url,
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
