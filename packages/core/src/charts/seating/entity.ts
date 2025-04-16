import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const Seating = new Entity({
  model: {
    entity: 'seating',
    version: '1',
    service: 'app',
  },
  attributes: {
    id: {
      label: 'seatingId',
      type: 'string',
      required: true,
      default: () => ulid(),
    },
    chartId: {
      type: 'string',
      required: true,
    },
    userId: {
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
      collection: 'charts',
      type: 'clustered',
      pk: {
        field: 'pk',
        composite: ['userId'],
      },
      sk: {
        field: 'sk',
        composite: ['chartId', 'id'],
      },
    },
  },
});

export type SeatingItem = EntityItem<typeof Seating>;
