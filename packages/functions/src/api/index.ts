import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import school from './school';
import user from './user';
import student from './student';
import { logger } from 'hono/logger';

const app = new Hono()
  .use(logger())
  .route('/school', school)
  .route('/user', user)
  .route('student', student);

export const handler = handle(app);
export type App = typeof app;
