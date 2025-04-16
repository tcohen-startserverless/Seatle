import { SeatSchemas } from './schema';
import { DB } from '@core/dynamo';
import { Schemas } from '@core/schema';

export namespace SeatService {
  export const create = async (
    ctx: Schemas.Types.Context,
    input: SeatSchemas.Types.Create
  ) => {
    const res = await DB.entities.Seat.create({
      userId: ctx.userId,
      ...input,
    }).go();
    return res.data;
  };

  export const get = async (
    ctx: Schemas.Types.Context,
    input: SeatSchemas.Types.NestedParams
  ) => {
    const res = await DB.entities.Seat.get({ userId: ctx.userId, ...input }).go();
    return res.data;
  };

  export const listByChart = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Seat.query
      .byChart({ userId: ctx.userId, chartId: params.id })
      .go(pagination);
    return res;
  };

  export const listByPerson = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    pagination: Schemas.Types.Pagination
  ) => {
    return await DB.entities.Seat.query
      .byPerson({ userId: ctx.userId, personId: params.id })
      .go(pagination);
  };

  export const patch = async (
    ctx: Schemas.Types.Context,
    params: SeatSchemas.Types.NestedParams,
    input: SeatSchemas.Types.Patch
  ) => {
    const res = await DB.entities.Seat.patch({ userId: ctx.userId, ...params })
      .set({
        ...input,
      })
      .go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async (
    ctx: Schemas.Types.Context,
    params: SeatSchemas.Types.NestedParams
  ) => {
    const res = await DB.entities.Seat.remove({
      userId: ctx.userId,
      chartId: params.chartId,
      id: params.id,
    }).go({ response: 'all_old' });
    return res.data;
  };
}
