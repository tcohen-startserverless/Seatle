import { createClient } from '@openauthjs/openauth/client';
import { createMiddleware } from 'hono/factory';
import { subjects } from './subjects';

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
      c.set('userId', id);
      c.set('userEmail', email);
      c.set('userRole', role || 'user');
    }
    if (verified.tokens) {
      c.header('X-Auth-Token', verified.tokens.access);
    }
    await next();
  });
};
