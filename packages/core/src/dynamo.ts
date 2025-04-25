import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Service } from 'electrodb';
import { Chart } from '@core/charts/chart';
import { List } from '@core/list';
import { Person } from '@core/person';
import { Furniture } from './charts';
import { Assignment } from './charts';
import { User } from '@core/user';

const table = Resource.Table.name;
const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const Config = {
  table,
  client,
};

export const DB = new Service(
  {
    Chart,
    List,
    Person,
    User,
    Assignment,
    Furniture,
  },
  {
    table,
    client,
  }
);
