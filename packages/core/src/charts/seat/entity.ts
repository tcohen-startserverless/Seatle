import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const Seat = new Entity({
  model: {
    entity: 'seat',
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
    chartId: {
      type: 'string',
      required: true,
    },
    personId: {
      type: 'string',
      required: false,
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
      pk: {
        field: 'pk',
        composite: ['userId'],
      },
      sk: {
        field: 'sk',
        composite: ['chartId', 'id'],
      },
    },
    byPerson: {
      index: 'GSI1',
      pk: {
        field: 'gsi1pk',
        composite: ['userId', 'personId'],
      },
      sk: {
        field: 'gsi1sk',
        composite: ['chartId', 'id'],
      },
    },
    byChart: {
      index: 'GSI2',
      pk: {
        field: 'gsi2pk',
        composite: ['userId', 'chartId'],
      },
      sk: {
        field: 'gsi2sk',
        composite: ['type', 'id'],
      },
    },
  },
});

export type SeatItem = EntityItem<typeof Seat>;
