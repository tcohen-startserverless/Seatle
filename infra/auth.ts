export const authTable = new sst.aws.Dynamo('auth', {
  fields: {
    pk: 'string',
    sk: 'string',
    gsi1pk: 'string',
    gsi1sk: 'string',
  },
  primaryIndex: {
    hashKey: 'pk',
    rangeKey: 'sk',
  },
  globalIndexes: {
    gsi1: {
      hashKey: 'gsi1pk',
      rangeKey: 'gsi1sk',
    },
  },
});

export const authFunction = new sst.aws.Function('authFunction', {
  handler: 'packages/functions/src/auth/handler.handler',
  link: [authTable],
  url: true,
});
