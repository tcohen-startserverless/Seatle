import { Entity } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const School = new Entity(
  {
    model: {
      entity: 'school',
      version: '1',
      service: '',
    },
    attributes: {
      schoolId: {
        type: 'string',
        required: true,
        default: () => ulid(),
      },
      name: {
        type: 'string',
        required: true,
      },
      address: {
        type: 'string',
        required: false,
      },
      city: {
        type: 'string',
        required: false,
      },
      state: {
        type: 'string',
        required: false,
      },
      zipCode: {
        type: 'string',
        required: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
      status: {
        type: ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'] as const,
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
        scope: 'school',
        pk: {
          field: 'pk',
          composite: [],
        },
        sk: {
          field: 'sk',
          composite: ['schoolId'],
        },
      },
      // byName: {
      //   index: 'gsi1',
      //   pk: {
      //     field: 'gsi1pk',
      //     composite: ['schoolId'],
      //   },
      //   sk: {
      //     field: 'gsi1sk',
      //     composite: ['name'],
      //   },
      // },
    },
  },
  Config
);
