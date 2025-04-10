import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { UserSchemas, UserService } from '@core/user';
import { Enviroment } from '@functions/auth/middleware';

const app = new Hono<Enviroment>();

export default app
  .get('/me', async (c) => {
    const ctx = c.get('ctx');
    const user = await UserService.getById(ctx);
    return c.json(user);
  })
  .patch('/me', vValidator('json', UserSchemas.Patch), async (c) => {
    const ctx = c.get('ctx');
    const data = c.req.valid('json');
    const updatedUser = await UserService.patch(ctx, data);
    return c.json(updatedUser);
  });
