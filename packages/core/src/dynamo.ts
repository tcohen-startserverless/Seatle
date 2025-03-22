import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Service } from 'electrodb';
import { Chart } from '@core/charts/chart';
import { List } from '@core/people/list';
import { Person } from '@core/people/person';
import { Seat } from '@core/charts/seat';
import { Seating } from '@core/charts/seating';
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
    Seat,
    Seating,
    User,
  },
  {
    table,
    client,
  }
);
