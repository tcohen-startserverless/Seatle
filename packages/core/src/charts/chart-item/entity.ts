import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const ChartItem = new Entity({
  model: {
    entity: 'chartItem',
    version: '1',
    service: 'app',
  },
  attributes: {
    id: {
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
    type: {
      type: ['TABLE', 'CHAIR', 'OTHER'] as const,
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
    },
    height: {
      type: 'number',
      required: true,
    },
    size: {
      type: 'number',
      required: false,
    },
    cells: {
      type: 'number',
      required: false,
    },
    properties: {
      type: 'map',
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
    byChart: {
      index: 'GSI1',
      pk: {
        field: 'gsi1pk',
        composite: ['userId'],
      },
      sk: {
        field: 'gsi1sk',
        composite: ['chartId', 'id'],
      },
    },
  },
});

export type ChartItemEntity = EntityItem<typeof ChartItem>;