import { Entity, EntityItem } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const Seat = new Entity(
  {
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
      seatingId: {
        type: 'string',
        required: true,
      },
      schoolId: {
        type: 'string',
        required: true,
      },
      classId: {
        type: 'string',
        required: true,
      },
      studentId: {
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
      label: {
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
          composite: ['schoolId', 'classId', 'seatingId'],
        },
        sk: {
          field: 'sk',
          composite: ['id'],
        },
      },
      byStudent: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['studentId'],
        },
        sk: {
          field: 'gsi1sk',
          composite: ['schoolId', 'classId', 'seatingId'],
        },
      },
    },
  },
  Config
);

export type SeatItem = EntityItem<typeof Seat>;
