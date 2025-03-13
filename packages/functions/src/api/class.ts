import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { SchoolSchemas, SchoolService } from '@core/school';

const app = new Hono().post(
  '/',
  vValidator('json', SchoolSchemas.CreateSchoolInput),
  async (c) => {
    const data = c.req.valid('json');
    const school = await SchoolService.create(data);
    return c.json(school, 201);
  }
);

export default app;
