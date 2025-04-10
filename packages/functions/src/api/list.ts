import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { ListSchemas, ListService } from '@core/list';
import { Schemas } from '@core/schema';
import { Enviroment } from '@functions/auth/middleware';

const app = new Hono<Enviroment>();

export default app
  .get('/', vValidator('query', Schemas.Pagination), async (c) => {
    const ctx = c.get('ctx');
    const pagination = c.req.valid('query');
    const lists = await ListService.list(ctx, pagination);
    return c.json(lists);
  })
  .get(
    '/status/:status',
    vValidator('query', Schemas.Pagination),
    vValidator('param', ListSchemas.ListByStatus),
    async (c) => {
      const ctx = c.get('ctx');
      const status = c.req.valid('param');
      const pagination = c.req.valid('query');
      const lists = await ListService.listByStatus(ctx, status, pagination);
      return c.json(lists);
    }
  )
  .get('/:id', async (c) => {
    const ctx = c.get('ctx');
    const id = c.req.param('id');
    const list = await ListService.get(ctx, { id });
    return c.json(list);
  })
  .post('/', vValidator('json', ListSchemas.Create), async (c) => {
    const ctx = c.get('ctx');
    const data = c.req.valid('json');
    const list = await ListService.create(ctx, data);
    return c.json(list);
  })
  .patch('/:id', vValidator('json', ListSchemas.Patch), async (c) => {
    const ctx = c.get('ctx');
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const list = await ListService.patch(ctx, { id }, data);
    return c.json(list);
  })
  .delete('/:id', async (c) => {
    const ctx = c.get('ctx');
    const id = c.req.param('id');
    const list = await ListService.remove(ctx, { id });
    return c.json(list);
  });
