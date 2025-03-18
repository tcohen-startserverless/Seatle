import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Service } from 'electrodb';
import { Chart } from '@core/chart';
import { ContactList } from '@core/contactList';
import { Person } from '@core/person';
import { Seat } from '@core/seat';
import { Seating } from '@core/seating';
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
    ContactList,
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
