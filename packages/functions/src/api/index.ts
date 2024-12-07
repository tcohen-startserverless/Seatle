import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import school from './school';
import user from './user';

const app = new Hono().route('/school', school).route('/user', user);

export const handler = handle(app);
export type App = typeof app;
