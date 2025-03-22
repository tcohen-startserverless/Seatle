import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const Chart = new Entity({
  model: {
    entity: 'chart',
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
    width: {
      type: 'number',
      required: true,
      default: 800,
    },
    height: {
      type: 'number',
      required: true,
      default: 600,
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
      index: 'gsi1',
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

export type ChartItem = EntityItem<typeof Chart>;
