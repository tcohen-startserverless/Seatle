import { email } from './email';
import { table } from './storage';

export const auth = new sst.aws.Auth('Auth', {
  issuer: {
    handler: 'packages/functions/src/auth/index.handler',
    link: [table, email],
  },
});
