import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import user from './user';
import person from './person';
import seating from './seating';
import chart from './chart';
import list from './list';
import { logger } from 'hono/logger';
import { authMiddleware } from '@functions/auth/middleware';

const app = new Hono()
  .use(logger())
  .use(authMiddleware())
  .route('/user', user)
  .route('/student', person)
  .route('/seating', seating)
  .route('/person', person)
  .route('/list', list)
  .route('/chart', chart);

export const handler = handle(app);
export type App = typeof app;
