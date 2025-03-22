import { SeatSchemas } from './schema';
import { DB } from '@core/dynamo';

export namespace SeatService {
  export const create = async (input: SeatSchemas.Types.Create) => {
    const res = await DB.entities.Seat.create(input).go();
    return res.data;
  };

  export const get = async (input: SeatSchemas.Types.Get) => {
    const { userId, chartId, id } = input;
    const res = await DB.entities.Seat.get({ userId, chartId, id }).go();
    return res.data;
  };

  export const listByChart = async (input: SeatSchemas.Types.ListByChart) => {
    const { cursor, userId, chartId } = input;
    const res = await DB.entities.Seat.query.byChart({ userId, chartId }).go({
      cursor,
    });
    return res;
  };

  export const listByPerson = async (input: SeatSchemas.Types.ListByPerson) => {
    const { cursor, userId, personId } = input;
    return await DB.entities.Seat.query.byPerson({ userId, personId }).go({
      cursor,
    });
  };

  export const patch = async (
    params: SeatSchemas.Types.Get,
    input: SeatSchemas.Types.Patch
  ) => {
    const { userId, chartId, id } = params;
    const res = await DB.entities.Seat.patch({ userId, chartId, id })
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (params: SeatSchemas.Types.Get) => {
    const { userId, chartId, id } = params;
    const res = await DB.entities.Seat.remove({ userId, chartId, id }).go();
    return res.data;
  };
}
