import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const Furniture = new Entity({
  model: {
    entity: 'furniture',
    version: '1',
    service: 'app',
  },
  attributes: {
    id: {
      label: 'furnitureId',
      type: 'string',
      required: true,
      default: () => ulid(),
    },
    userId: {
      type: 'string',
      required: true,
    },
    chartId: {
      type: 'string',
      required: true,
    },
    x: {
      type: 'number',
      required: true,
    },
    y: {
      type: 'number',
      required: true,
    },
    width: {
      type: 'number',
      required: true,
      default: 60,
    },
    height: {
      type: 'number',
      required: true,
      default: 60,
    },
    rotation: {
      type: 'number',
      required: false,
      default: 0,
    },
    type: {
      type: ['TABLE', 'DESK', 'CHAIR', 'OTHER'] as const,
      required: true,
      default: 'CHAIR',
    },
    label: {
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

export type FurnitureItem = EntityItem<typeof Furniture>;