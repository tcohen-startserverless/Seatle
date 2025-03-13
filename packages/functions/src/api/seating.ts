import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import * as v from 'valibot';
import { SeatingSchemas, SeatingService } from '@core/seating';
import { SeatSchemas, SeatService } from '@core/seat';

const app = new Hono()
  .post('/', vValidator('json', SeatingSchemas.CreateInput), async (c) => {
    const data = c.req.valid('json');
    const seating = await SeatingService.create(data);
    return c.json(seating, 201);
  })
  .get('/', vValidator('query', SeatingSchemas.ListInput), async (c) => {
    const params = c.req.valid('query');
    const res = await SeatingService.list(params);
    return c.json(res);
  })
  .get('/:id', vValidator('param', SeatSchemas.GetInput), async (c) => {
    const { id } = c.req.valid('param');
    const { userId } = c.req.valid('query');
    const seating = await SeatingService.get({
      userId,
      id,
    });
    return c.json(seating);
  })
  .patch(
    '/:id',
    vValidator('param', v.object({ id: v.string() })),
    vValidator('json', SeatingSchemas.PatchInput),
    async (c) => {
      const { id } = c.req.valid('param');
      const { schoolId, classId } = c.req.valid('query');
      const data = c.req.valid('json');

      const updatedSeating = await SeatingService.patch({ id, schoolId, classId }, data);

      return c.json(updatedSeating);
    }
  )
  .delete('/:id', vValidator('param', v.object({ id: v.string() })), async (c) => {
    const { id } = c.req.valid('param');
    const { schoolId, classId } = c.req.valid('query');

    const result = await SeatingService.remove({
      id,
      schoolId,
      classId,
    });

    return c.json(result);
  });

app.route(
  '/:seatingId/seats',
  new Hono()
    .post('/', vValidator('json', SeatSchemas.CreateInput), async (c) => {
      const data = c.req.valid('json');
      const seat = await SeatService.create(data);
      return c.json(seat, 201);
    })
    .post('/batch', vValidator('json', v.array(SeatSchemas.CreateInput)), async (c) => {
      const seats = c.req.valid('json');
      const result = await SeatService.batchCreate(seats);
      return c.json(result, 201);
    })
    .get('/', vValidator('query', SeatSchemas.ListInput), async (c) => {
      const params = c.req.valid('query');
      const res = await SeatService.list(params);
      return c.json(res);
    })
    .patch(
      '/:id',
      vValidator('param', v.object({ id: v.string() })),
      vValidator('json', SeatSchemas.PatchInput),
      async (c) => {
        const { id } = c.req.valid('param');
        const { schoolId, classId, seatingId } = c.req.valid('query');
        const data = c.req.valid('json');

        const updatedSeat = await SeatService.patch(
          { id, schoolId, classId, seatingId },
          data
        );

        return c.json(updatedSeat);
      }
    )
    .delete('/:id', vValidator('param', v.object({ id: v.string() })), async (c) => {
      const { id } = c.req.valid('param');
      const { schoolId, classId, seatingId } = c.req.valid('query');

      const result = await SeatService.remove({
        id,
        schoolId,
        classId,
        seatingId,
      });

      return c.json(result);
    })
);

export default app;
