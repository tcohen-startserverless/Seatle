import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import user from './user';
import person from './person';
import chart from './chart';
import list from './list';
import furniture from './furniture';
import assignment from './assignment';
import { logger } from 'hono/logger';
import { authMiddleware } from '@functions/auth/middleware';

const app = new Hono()
  .use(logger())
  .use(authMiddleware())
  .route('/user', user)
  .route('/person', person)
  .route('/list', list)
  .route('/chart', chart)
  .route('/furniture', furniture)
  .route('/assignment', assignment);

export const handler = handle(app);
export type App = typeof app;
