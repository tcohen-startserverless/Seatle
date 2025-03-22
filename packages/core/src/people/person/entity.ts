import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const Person = new Entity({
  model: {
    entity: 'person',
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
    firstName: {
      type: 'string',
      required: true,
    },
    lastName: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: false,
    },
    phone: {
      type: 'string',
      required: false,
    },
    notes: {
      type: 'string',
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
        composite: ['id'],
      },
    },
    byName: {
      index: 'gsi1',
      pk: {
        field: 'gsi1pk',
        composite: ['userId'],
      },
      sk: {
        field: 'gsi1sk',
        composite: ['lastName', 'firstName'],
      },
    },
  },
});

export type PersonItem = EntityItem<typeof Person>;
