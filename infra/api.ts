import { bucket, table } from './storage';
import { authFunction } from './auth';

export const api = new sst.aws.Function('api', {
  url: true,
  link: [bucket, table],
  handler: 'packages/functions/src/api/index.handler',
  environment: {
    OPENAUTH_ISSUER: authFunction.url.apply((v) => v!.replace(/\/$/, '')),
  },
});
