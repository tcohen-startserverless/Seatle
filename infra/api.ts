import { bucket, table, authTable } from './storage';

const auth = new sst.aws.Auth('Auth', {
  authorizer: {
    handler: 'packages/functions/src/auth.handler',
    link: [authTable],
  },
});

export const myApi = new sst.aws.Function('MyApi', {
  url: true,
  link: [bucket, table],
  handler: 'packages/functions/src/api/index.handler',
  environment: {
    OPENAUTH_ISSUER: auth.url.apply((v) => v!.replace(/\/$/, '')),
  },
});
