import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { StudentSchemas, StudentService } from '@core/student';

const app = new Hono()
  .post('/', vValidator('json', StudentSchemas.CreateInput), async (c) => {
    const data = c.req.valid('json');
    const student = await StudentService.create(data);
    return c.json(student, 201);
  })
  .get('/', vValidator('query', StudentSchemas.ListInput), async (c) => {
    const { schoolId, cursor } = c.req.valid('query');
    const res = await StudentService.list({ schoolId, cursor });
    return c.json(res);
  })
  .get('/:schoolId/:id', async (c) => {
    const id = c.req.param('id');
    const schoolId = c.req.param('schoolId');
    const student = await StudentService.get({
      schoolId,
      id,
    });
    if (!student) {
      return c.json({ message: 'Student not found' }, 404);
    }
    return c.json(student);
  })
  .put('/:schoolId/:id', vValidator('json', StudentSchemas.PatchInput), async (c) => {
    const id = c.req.param('id');
    const schoolId = c.req.param('schoolId');
    const data = c.req.valid('json');
    const updatedStudent = await StudentService.patch(
      {
        id,
        schoolId,
      },
      data
    );
    return c.json(updatedStudent);
  })
  .delete('/:schoolId/:id', async (c) => {
    const id = c.req.param('id');
    const schoolId = c.req.param('schoolId');
    const result = await StudentService.remove({
      id,
      schoolId,
    });
    return c.json(result);
  });

export default app;
