import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { SchoolSchemas, SchoolService } from '@core/school';

const app = new Hono();

app
  .post('/', vValidator('json', SchoolSchemas.CreateSchoolInput), async (c) => {
    const data = c.req.valid('json');
    const school = await SchoolService.create(data);
    return c.json(school, 201);
  })
  .get('/', async (c) => {
    const cursor = c.req.query('cursor');
    const res = await SchoolService.list(cursor);
    return c.json(res);
  })
  .get('/:schoolId', async (c) => {
    const schoolId = c.req.param('schoolId');
    const school = await SchoolService.getById(schoolId);
    if (!school) {
      return c.json({ message: 'School not found' }, 404);
    }
    return c.json(school);
  })
  .patch('/:schoolId', vValidator('json', SchoolSchemas.PatchSchoolInput), async (c) => {
    const schoolId = c.req.param('schoolId');
    const data = c.req.valid('json');
    const updatedSchool = await SchoolService.patch(schoolId, data);
    return c.json(updatedSchool);
  })
  .delete('/:schoolId', async (c) => {
    const schoolId = c.req.param('schoolId');
    const result = await SchoolService.remove(schoolId);
    return c.json(result);
  });

export default app;
