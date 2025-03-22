import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const List = new Entity({
  model: {
    entity: 'List',
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
    name: {
      type: 'string',
      required: true,
    },
    description: {
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
        composite: ['userId'],
      },
      sk: {
        field: 'sk',
        composite: ['id'],
      },
    },
    byStatus: {
      index: 'GSI1',
      pk: {
        field: 'gsi1pk',
        composite: ['userId'],
      },
      sk: {
        field: 'gsi1sk',
        composite: ['status', 'createdAt'],
      },
    },
  },
});

export type ListItem = EntityItem<typeof List>;
