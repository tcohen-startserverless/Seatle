import { handle } from 'hono/aws-lambda';
import { authServer } from './server';

export const handler = handle(authServer);