import { bucket, table } from './storage';
import { auth } from './auth';

export const api = new sst.aws.Function('api', {
  url: true,
  link: [bucket, table, auth],
  handler: 'packages/functions/src/api/index.handler',
});
