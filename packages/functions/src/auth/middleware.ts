import { createClient } from '@openauthjs/openauth/client';
import { createMiddleware } from 'hono/factory';
import { subjects } from './subjects';

export const authMiddleware = () => {
  const authClient = createClient({
    clientID: 'school-app',
    issuer: process.env.AUTH_URL || '',
  });

  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow the request to continue without authentication
      // You can customize this to reject unauthorized requests
      await next();
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      const verified = await authClient.verify(subjects, token);
      
      if (verified.subject) {
        // Add user info to context
        c.set('userId', verified.subject.properties.userId);
        c.set('userEmail', verified.subject.properties.email);
        c.set('userRole', verified.subject.properties.role || 'user');
        c.set('schoolId', verified.subject.properties.schoolId);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      // Continue without setting user info
    }
    
    await next();
  });
};