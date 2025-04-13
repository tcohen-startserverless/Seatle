import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const ChartAssignment = new Entity({
  model: {
    entity: 'chartAssignment',
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
    chartItemId: {
      type: 'string',
      required: true,
    },
    personId: {
      type: 'string',
      required: true,
    },
    seatIndex: {
      type: 'number',
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
        composite: ['chartId', 'chartItemId'],
      },
    },
    byPerson: {
      index: 'GSI2',
      pk: {
        field: 'gsi2pk',
        composite: ['userId'],
      },
      sk: {
        field: 'gsi2sk',
        composite: ['personId', 'chartId'],
      },
    },
  },
});

export type ChartAssignmentEntity = EntityItem<typeof ChartAssignment>;