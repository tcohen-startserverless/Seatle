export const bucket = new sst.aws.Bucket('MyBucket');
export const table = new sst.aws.Dynamo('MyTable', {
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
