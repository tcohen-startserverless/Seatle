import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { PersonSchema, PersonService } from '@core/person';
import { Schemas } from '@core/schema';
import { Enviroment } from '@functions/auth/middleware';

const app = new Hono<Enviroment>();

export default app
  .post('/', vValidator('json', PersonSchema.Create), async (c) => {
    const ctx = c.get('ctx');
    const data = c.req.valid('json');
    const person = await PersonService.create(ctx, data);
    return c.json(person, 201);
  })
  .get('/', vValidator('query', Schemas.Pagination), async (c) => {
    const ctx = c.get('ctx');
    const pagination = c.req.valid('query');
    const res = await PersonService.list(ctx, pagination);
    return c.json(res);
  })
  .get('/:id', async (c) => {
    const ctx = c.get('ctx');
    const id = c.req.param('id');
    const person = await PersonService.get(ctx, { id });
    if (!person) {
      return c.json({ message: 'Person not found' }, 404);
    }
    return c.json(person);
  })
  .put('/:id', vValidator('json', PersonSchema.Patch), async (c) => {
    const ctx = c.get('ctx');
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const updatedPerson = await PersonService.patch(ctx, { id }, data);
    return c.json(updatedPerson);
  })
  .delete('/:id', async (c) => {
    const ctx = c.get('ctx');
    const id = c.req.param('id');
    const result = await PersonService.remove(ctx, { id });
    return c.json(result);
  });
