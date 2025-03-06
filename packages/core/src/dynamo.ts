import { Resource } from 'sst/resource';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Service } from 'electrodb';
import { Chart } from './chart';
import { Person } from './person';
import { Seat } from './seat';
import { Seating } from './seating';
import { User } from './user';

const table = Resource.MyTable.name;
const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const Config = {
  table,
  client,
};

export const DB = new Service(
  {
    Chart,
    Person,
    Seat,
    Seating,
    User,
  },
  {
    table,
    client,
  }
);
