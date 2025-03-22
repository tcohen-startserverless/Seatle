import { bucket, table } from './storage';

export const api = new sst.aws.Function('api', {
  url: true,
  link: [bucket, table],
  handler: 'packages/functions/src/api/index.handler',
  // environment: {
  //   OPENAUTH_ISSUER: auth.url.apply((v) => v!.replace(/\/$/, '')),
  // },
});
