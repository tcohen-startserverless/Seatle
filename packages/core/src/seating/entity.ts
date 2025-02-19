import { Entity, EntityItem } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const Seating = new Entity(
  {
    model: {
      entity: 'seating',
      version: '1',
      service: 'app',
    },
    attributes: {
      id: {
        type: 'string',
        required: true,
        default: () => ulid(),
      },
      schoolId: {
        type: 'string',
        required: true,
      },
      classId: {
        type: 'string',
        required: true,
      },
      name: {
        type: 'string',
        required: true,
      },
      rows: {
        type: 'number',
        required: true,
      },
      columns: {
        type: 'number',
        required: true,
      },
      status: {
        type: ['ACTIVE', 'ARCHIVED'] as const,
        required: true,
        default: 'ACTIVE',
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
          composite: ['schoolId', 'classId'],
        },
        sk: {
          field: 'sk',
          composite: ['id'],
        },
      },
      byClass: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['classId'],
        },
        sk: {
          field: 'gsi1sk',
          composite: ['status', 'id'],
        },
      },
    },
  },
  Config
);

export type SeatingItem = EntityItem<typeof Seating>;
