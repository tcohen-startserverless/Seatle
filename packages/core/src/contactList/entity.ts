import { Entity, EntityItem } from 'electrodb';
import { Config } from '@core/dynamo';
import { ulid } from 'ulid';

export const ContactList = new Entity(
  {
    model: {
      entity: 'contactList',
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
      personIds: {
        type: 'list',
        items: 'string',
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
  },
  Config
);

export type ContactListItem = EntityItem<typeof ContactList>;