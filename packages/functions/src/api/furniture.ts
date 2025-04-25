import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { ChartSchemas } from '@core/charts/chart';
import { FurnitureSchemas, FurnitureService } from '@core/charts/furniture';
import { Schemas } from '@core/schema';
import { Enviroment } from '@functions/auth/middleware';

const app = new Hono<Enviroment>()
  .get(
    '/',
    vValidator('query', Schemas.Pagination),
    vValidator('param', Schemas.Params),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const pagination = c.req.valid('query');
      const furniture = await FurnitureService.listByChart(ctx, params, pagination);
      return c.json(furniture);
    }
  )
  .post(
    '/',
    vValidator('json', FurnitureSchemas.Create),
    vValidator('param', Schemas.Params),
    async (c) => {
      const ctx = c.get('ctx');
      const data = c.req.valid('json');
      const params = c.req.valid('param');
      const furniture = await FurnitureService.create(ctx, {
        ...data,
        chartId: params.id,
      });
      return c.json(furniture, 201);
    }
  )
  .get('/:furnitureId', vValidator('param', ChartSchemas.NestedParams), async (c) => {
    const ctx = c.get('ctx');
    const params = c.req.valid('param');
    const furniture = await FurnitureService.get(ctx, {
      chartId: params.id,
      id: params.furnitureId,
    });
    return c.json(furniture);
  })
  .patch(
    '/:furnitureId',
    vValidator('json', FurnitureSchemas.Patch),
    vValidator('param', ChartSchemas.NestedParams),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const data = c.req.valid('json');
      const furniture = await FurnitureService.patch(
        ctx,
        {
          chartId: params.id,
          id: params.furnitureId,
        },
        data
      );
      return c.json(furniture);
    }
  )
  .delete('/:furnitureId', vValidator('param', ChartSchemas.NestedParams), async (c) => {
    const ctx = c.get('ctx');
    const params = c.req.valid('param');
    const result = await FurnitureService.remove(ctx, {
      chartId: params.id,
      id: params.furnitureId,
    });
    return c.json(result);
  });

export default app;
