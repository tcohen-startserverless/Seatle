import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { ChartSchemas, ChartService } from '@core/charts/chart';
import { SeatSchemas, SeatService } from '@core/charts/seat';
import { Schemas } from '@core/schema';
import { Enviroment } from '@functions/auth/middleware';

const app = new Hono<Enviroment>();

export default app
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
  .delete('/:id', vValidator('param', Schemas.Params), async (c) => {
    const ctx = c.get('ctx');
    const params = c.req.valid('param');
    const result = await ChartService.remove(ctx, params);
    return c.json(result);
  })
  .get(
    '/:chartId/seats',
    vValidator('query', Schemas.Pagination),
    vValidator('param', Schemas.Params),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const pagination = c.req.valid('query');
      const seats = await SeatService.listByChart(ctx, params, pagination);
      return c.json(seats);
    }
  )
  .post(
    '/:chartId/seats',
    vValidator('json', SeatSchemas.Create),
    vValidator('param', SeatSchemas.ChartIdParam),
    async (c) => {
      const ctx = c.get('ctx');
      const data = c.req.valid('json');
      const params = c.req.valid('param');
      const seat = await SeatService.create(ctx, { ...data, chartId: params.chartId });
      return c.json(seat, 201);
    }
  )
  .get(
    '/:chartId/seats/:id',
    vValidator('param', SeatSchemas.NestedParams),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const seat = await SeatService.get(ctx, params);
      return c.json(seat);
    }
  )
  .patch(
    '/:chartId/seats/:id',
    vValidator('json', SeatSchemas.Patch),
    vValidator('param', SeatSchemas.NestedParams),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const data = c.req.valid('json');
      const seat = await SeatService.patch(ctx, params, data);
      return c.json(seat);
    }
  )
  .delete(
    '/:chartId/seats/:id',
    vValidator('param', SeatSchemas.NestedParams),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const result = await SeatService.remove(ctx, params);
      return c.json(result);
    }
  );
