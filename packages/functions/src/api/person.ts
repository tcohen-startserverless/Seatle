import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { PersonSchema, PersonService } from '@core/person';

const app = new Hono()
  .post('/', vValidator('json', PersonSchema.CreateInput), async (c) => {
    const data = c.req.valid('json');
    const student = await PersonService.create(data);
    return c.json(student, 201);
  })
  .get('/', vValidator('query', PersonSchema.ListInput), async (c) => {
    const { userId, cursor } = c.req.valid('query');
    const res = await PersonService.list({ userId, cursor });
    return c.json(res);
  })
  .get('/:userId/:id', async (c) => {
    const id = c.req.param('id');
    const userId = c.req.param('userId');
    const student = await PersonService.get({
      userId,
      id,
    });
    if (!student) {
      return c.json({ message: 'Student not found' }, 404);
    }
    return c.json(student);
  })
  .put('/:userId/:id', vValidator('json', PersonSchema.PatchInput), async (c) => {
    const id = c.req.param('id');
    const userId = c.req.param('userId');
    const data = c.req.valid('json');
    const updatedStudent = await PersonService.patch(
      {
        id,
        userId,
      },
      data
    );
    return c.json(updatedStudent);
  })
  .delete('/:userId/:id', async (c) => {
    const id = c.req.param('id');
    const userId = c.req.param('userId');
    const result = await PersonService.remove({
      id,
      userId,
    });
    return c.json(result);
  });

export default app;
