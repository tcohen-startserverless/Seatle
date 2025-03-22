import { table } from './storage';
import { email } from './email';

export const authTable = new sst.aws.Dynamo('authTable', {
  fields: {
    pk: 'string',
    sk: 'string',
  },
  primaryIndex: {
    hashKey: 'pk',
    rangeKey: 'sk',
  },
});

export const authApi = new sst.aws.Function('authApi', {
  handler: 'packages/functions/src/auth/index.handler',
  link: [authTable, table, email],
  permissions: [
    {
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    },
  ],
  url: true,
});
