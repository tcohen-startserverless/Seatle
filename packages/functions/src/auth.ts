import { authorizer } from '@openauthjs/openauth';
import { handle } from 'hono/aws-lambda';
import { DynamoStorage } from '@openauthjs/openauth/storage/dynamo';
import { subjects } from '@core/subject';
import { Resource } from 'sst';
import { CodeAdapter } from '@openauthjs/openauth/adapter/code';
import { CodeUI } from '@openauthjs/openauth/ui/code';

const app = authorizer({
  storage: DynamoStorage({
    table: Resource.AuthTable.name,
  }),
  subjects,
  providers: {
    code: CodeAdapter(
      CodeUI({
        sendCode: async (email, code) => {
          console.log(email, code);
        },
      })
    ),
  },
  success: async (ctx, value) => {
    if (value.provider === 'code') {
      return ctx.subject('user', {
        userId: '123',
        workspaceId: '123',
        email: 'test@email.com',
        // email: value.email,
      });
    }
    // return ctx.subject('user', { email: 'test@email.com' });
    throw new Error('Invalid provider');
  },
});

export const handler = handle(app);
