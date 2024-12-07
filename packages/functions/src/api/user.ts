import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { UserSchemas, UserService } from '@core/user';

const app = new Hono();

export default app
  .post('/users', vValidator('json', UserSchemas.CreateUserInput), async (c) => {
    const data = c.req.valid('json');
    const user = await UserService.create(data);
    return c.json(user, 201);
  })
  .get('/users/me', async (c) => {
    const userId = c.get('userId');
    const user = await UserService.getById({ userId });
    return c.json(user);
  })
  .patch('/users/me', vValidator('json', UserSchemas.PatchUserInput), async (c) => {
    const userId = c.get('userId');
    const data = c.req.valid('json');
    const updatedUser = await UserService.patch({ userId, data });
    return c.json(updatedUser);
  });
