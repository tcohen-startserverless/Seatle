import { Resource } from 'sst/resource';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const table = Resource.MyTable.name;
const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const Config = {
  table,
  client,
};
