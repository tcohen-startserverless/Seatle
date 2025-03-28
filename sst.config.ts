/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'seater',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          profile: 'trevor-dev',
          region: 'us-west-2',
        },
      },
    };
  },
  async run() {
    await import('./infra/domain');
    await import('./infra/storage');
    await import('./infra/email');
    await import('./infra/auth');
    await import('./infra/api');
    await import('./infra/app');
  },
  console: {
    autodeploy: {
      runner: {
        timeout: '15 minutes',
        engine: 'codebuild',
      },
      target(event) {
        if (
          event.type === 'branch' &&
          event.branch === 'main' &&
          event.action === 'pushed'
        ) {
          return { stage: 'dev' };
        }
      },
    },
  },
});
