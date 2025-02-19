import { Entity, EntityItem } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const Class = new Entity(
  {
    model: {
      entity: 'class',
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
      name: {
        type: 'string',
        required: true,
      },
      teacherId: {
        type: 'string',
        required: true,
      },
      period: {
        type: 'string',
        required: false,
      },
      subject: {
        type: 'string',
        required: false,
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
          composite: ['schoolId'],
        },
        sk: {
          field: 'sk',
          composite: ['id'],
        },
      },
      byTeacher: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['teacherId'],
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

export type ClassItem = EntityItem<typeof Class>;
