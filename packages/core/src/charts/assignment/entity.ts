import { Entity, EntityItem } from 'electrodb';
import { ulid } from 'ulid';

export const Assignment = new Entity({
  model: {
    entity: 'assignment',
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
    furnitureId: {
      type: 'string',
      required: true,
    },
    personId: {
      type: 'string',
      required: true,
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
    byPerson: {
      index: 'GSI1',
      pk: {
        field: 'gsi1pk',
        composite: ['userId'],
      },
      sk: {
        field: 'gsi1sk',
        composite: ['personId'],
      },
    },
    byFurniture: {
      index: 'GSI2',
      pk: {
        field: 'gsi2pk',
        composite: ['userId'],
      },
      sk: {
        field: 'gsi2sk',
        composite: ['furnitureId'],
      },
    },
  },
});

export type AssignmentItem = EntityItem<typeof Assignment>;