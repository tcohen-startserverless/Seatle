import { Entity } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const User = new Entity(
  {
    model: {
      entity: 'user',
      version: '1',
      service: '',
    },
    attributes: {
      id: {
        type: 'string',
        required: true,
        default: () => ulid(),
      },
      email: {
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
      role: {
        type: ['TEACHER', 'ADMIN', 'STUDENT'] as const,
        required: true,
      },
      status: {
        type: ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'] as const,
        required: true,
        default: 'PENDING',
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
        scope: 'user',
        pk: {
          field: 'pk',
          composite: [],
        },
        sk: {
          field: 'sk',
          composite: ['id'],
        },
      },
      byEmail: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['email'],
        },
        sk: {
          field: 'gsi1sk',
          composite: [],
        },
      },
    },
  },
  Config
);
