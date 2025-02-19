import { Entity, EntityItem } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const Student = new Entity(
  {
    model: {
      entity: 'student',
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
      firstName: {
        type: 'string',
        required: true,
      },
      lastName: {
        type: 'string',
        required: true,
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
          composite: ['schoolId'],
        },
        sk: {
          field: 'sk',
          composite: ['id'],
        },
      },
    },
  },
  Config
);

export type StudentItem = EntityItem<typeof Student>;
