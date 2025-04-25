import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { ChartSchemas, ChartService } from '@core/charts/chart';
import { Schemas } from '@core/schema';
import { Enviroment } from '@functions/auth/middleware';
import assignments from './assignment';
import furniture from './furniture';

const app = new Hono<Enviroment>();

export default app
  .route('/:id/furniture', furniture)
  .route('/:id/assignments', assignments)
  .get('/', vValidator('query', Schemas.Pagination), async (c) => {
    const ctx = c.get('ctx');
    const pagination = c.req.valid('query');
    const charts = await ChartService.list(ctx, pagination);
    return c.json(charts);
  })
  .get(
    '/status/:status',
    vValidator('query', Schemas.Pagination),
    vValidator('param', ChartSchemas.ListByStatus),
    async (c) => {
      const ctx = c.get('ctx');
      const param = c.req.valid('param');
      const pagination = c.req.valid('query');
      const charts = await ChartService.listByStatus(ctx, param, pagination);
      return c.json(charts);
    }
  )
  .get('/:id', vValidator('param', Schemas.Params), async (c) => {
    const ctx = c.get('ctx');
    const param = c.req.valid('param');
    const chart = await ChartService.get(ctx, param);
    return c.json(chart);
  })
  .post('/', vValidator('json', ChartSchemas.Create), async (c) => {
    const ctx = c.get('ctx');
    const data = c.req.valid('json');
    const chart = await ChartService.create(ctx, data);
    return c.json(chart, 201);
  })
  .patch(
    '/:id',
    vValidator('json', ChartSchemas.Patch),
    vValidator('param', Schemas.Params),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const data = c.req.valid('json');
      const chart = await ChartService.patch(ctx, params, data);
      return c.json(chart);
    }
  )
  .patch(
    '/:id/layout',
    vValidator('json', ChartSchemas.UpdateLayout),
    vValidator('param', Schemas.Params),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const data = c.req.valid('json');
      const result = await ChartService.updateLayout(ctx, params, data);
      return c.json(result);
    }
  )
  .delete('/:id', vValidator('param', Schemas.Params), async (c) => {
    const ctx = c.get('ctx');
    const params = c.req.valid('param');
    const result = await ChartService.remove(ctx, params);
    return c.json(result);
  });
