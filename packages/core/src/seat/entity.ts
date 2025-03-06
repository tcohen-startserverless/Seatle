import { Entity, EntityItem } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const Seat = new Entity(
  {
    model: {
      entity: 'seat',
      version: '1',
      service: 'app',
    },
    attributes: {
      id: {
        type: 'string',
        required: true,
        default: () => ulid(),
      },
      userId: {
        type: 'string',
        required: true,
      },
      seatingId: {
        type: 'string',
        required: true,
      },
      personId: {
        type: 'string',
        required: false,
      },
      x: {
        type: 'number',
        required: true,
      },
      y: {
        type: 'number',
        required: true,
      },
      label: {
        type: 'string',
        required: false,
      },
      size: {
        type: 'number',
        required: false,
      },
      createdAt: {
        type: 'number',
        required: true,
        default: () => Date.now(),
      },
      updatedAt: {
        type: 'number',
        required: true,
        default: () => Date.now(),
      },
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['userId'],
        },
        sk: {
          field: 'sk',
          composite: ['seatingId', 'id'],
        },
      },
      byStudent: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['userId', 'personId'],
        },
        sk: {
          field: 'gsi1sk',
          composite: ['seatingId', 'id'],
        },
      },
    },
  },
  Config
);

export type SeatItem = EntityItem<typeof Seat>;
