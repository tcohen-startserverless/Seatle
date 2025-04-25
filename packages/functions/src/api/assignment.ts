import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { ChartSchemas } from '@core/charts/chart';
import { AssignmentSchemas, AssignmentService } from '@core/charts';
import { Schemas } from '@core/schema';
import { Enviroment } from '@functions/auth/middleware';

const app = new Hono<Enviroment>();

export default app
  .get(
    '/',
    vValidator('query', Schemas.Pagination),
    vValidator('param', ChartSchemas.NestedParams),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const pagination = c.req.valid('query');
      const assignments = await AssignmentService.listByChart(ctx, params, pagination);
      return c.json(assignments);
    }
  )
  .post(
    '/',
    vValidator('json', AssignmentSchemas.Create),
    vValidator('param', Schemas.Params),
    async (c) => {
      const ctx = c.get('ctx');
      const data = c.req.valid('json');
      const params = c.req.valid('param');
      const assignment = await AssignmentService.create(ctx, {
        ...data,
        chartId: params.id,
      });
      return c.json(assignment, 201);
    }
  )
  .get(
    '/:assignmentId',
    vValidator('param', ChartSchemas.NestedAssignment),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const assignment = await AssignmentService.get(ctx, {
        chartId: params.id,
        id: params.assignmentId,
      });
      return c.json(assignment);
    }
  )
  .patch(
    '/:assignmentId',
    vValidator('json', AssignmentSchemas.Patch),
    vValidator('param', ChartSchemas.NestedAssignment),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const data = c.req.valid('json');
      const assignment = await AssignmentService.patch(
        ctx,
        {
          chartId: params.id,
          id: params.assignmentId,
        },
        data
      );
      return c.json(assignment);
    }
  )
  .delete(
    '/:assignmentId',
    vValidator('param', ChartSchemas.NestedAssignment),
    async (c) => {
      const ctx = c.get('ctx');
      const params = c.req.valid('param');
      const result = await AssignmentService.remove(ctx, {
        chartId: params.id,
        id: params.assignmentId,
      });
      return c.json(result);
    }
  );
