import type {
  ApiGatewayRequestContextV2,
  LambdaContext,
  LambdaEvent,
} from 'hono/aws-lambda';
import type { ALBProxyEvent } from 'node_modules/hono/dist/types/adapter/aws-lambda/handler';
import { createClient } from '@openauthjs/openauth/client';
import { createMiddleware } from 'hono/factory';
import { subjects } from '@core/auth/subjects';

type Bindings = {
  event: Exclude<LambdaEvent, ALBProxyEvent>;
  lambdaContext: LambdaContext;
  requestContext: ApiGatewayRequestContextV2;
};

type Variables = {
  ctx: {
    userId: string;
    userEmail: string;
    userRole: string;
  };
};

export type Enviroment = {
  Bindings: Bindings;
  Variables: Variables;
};

export const authMiddleware = (options?: { requireAuth?: boolean }) => {
  const authClient = createClient({
    clientID: 'seater',
    issuer: process.env.AUTH_URL || '',
  });

  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (options?.requireAuth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      await next();
      return;
    }

    const token = authHeader.substring(7);

    const verified = await authClient.verify(subjects, token);
    if (verified.err) {
      console.log('Token verification failed:', verified.err);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    if (verified.subject.type === 'user' && verified.subject.properties) {
      const { id, email, role } = verified.subject.properties;
      c.set('ctx', {
        userId: id,
        userEmail: email,
        userRole: role || 'user',
      });
    }
    if (verified.tokens) {
      c.header('X-Auth-Token', verified.tokens.access);
    }
    await next();
  });
};
