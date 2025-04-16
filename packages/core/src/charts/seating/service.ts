import { DB } from '@core/dynamo';
import { SeatingSchemas } from './schema';
import { Schemas } from '@core/schema';

export namespace SeatingService {
  export const create = async (
    ctx: Schemas.Types.Context,
    input: SeatingSchemas.Types.Create
  ) => {
    const res = await DB.entities.Seating.create({
      userId: ctx.userId,
      ...input,
    }).go();
    return res.data;
  };

  export const get = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params & SeatingSchemas.Types.Key
  ) => {
    const res = await DB.entities.Seating.get({
      userId: ctx.userId,
      ...params,
    }).go();
    return res.data;
  };

  export const list = async (
    ctx: Schemas.Types.Context,
    input: Schemas.Types.Params,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Seating.query
      .primary({
        userId: ctx.userId,
        ...input,
      })
      .go(pagination);
    return res;
  };

  export const patch = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params & SeatingSchemas.Types.Key,
    input: SeatingSchemas.Types.Patch
  ) => {
    const res = await DB.entities.Seating.patch({
      userId: ctx.userId,
      ...params,
    })
      .set(input)
      .go();
    return res.data;
  };

  export const remove = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params & SeatingSchemas.Types.Key
  ) => {
    const res = await DB.entities.Seating.remove({
      userId: ctx.userId,
      ...params,
    }).go();
    return res.data;
  };
}
