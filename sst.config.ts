/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'school',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          profile: 'trevor-dev',
        },
      },
    };
  },
  async run() {
    await import('./infra/storage');
    await import('./infra/auth');
    await import('./infra/api');
    await import('./infra/app');
  },
});
