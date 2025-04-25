import { DB } from '@core/dynamo';
import { AssignmentSchemas } from './schema';
import { Schemas } from '@core/schema';

export namespace AssignmentService {
  export const create = async (
    ctx: Schemas.Types.Context,
    input: AssignmentSchemas.Types.Create
  ) => {
    const res = await DB.entities.Assignment.create({
      userId: ctx.userId,
      ...input,
    }).go();
    return res.data;
  };

  export const get = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params & { chartId: string }
  ) => {
    const res = await DB.entities.Assignment.get({
      userId: ctx.userId,
      chartId: params.chartId,
      id: params.id,
    }).go();
    return res.data;
  };

  export const listByChart = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Assignment.query
      .primary({
        userId: ctx.userId,
        chartId: params.id,
      })
      .go(pagination);
    return res;
  };

  export const listByPerson = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Assignment.query
      .byPerson({
        userId: ctx.userId,
        personId: params.id,
      })
      .go(pagination);
    return res;
  };

  export const listByFurniture = async (
    ctx: Schemas.Types.Context,
    input: AssignmentSchemas.Types.ListByFurniture,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Assignment.query
      .byFurniture({
        userId: ctx.userId,
        furnitureId: input.furnitureId,
      })
      .go(pagination);
    return res;
  };

  export const patch = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params & { chartId: string },
    input: AssignmentSchemas.Types.Patch
  ) => {
    const res = await DB.entities.Assignment.patch({
      userId: ctx.userId,
      chartId: params.chartId,
      id: params.id,
    })
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params & { chartId: string }
  ) => {
    const res = await DB.entities.Assignment.remove({
      userId: ctx.userId,
      chartId: params.chartId,
      id: params.id,
    }).go({ response: 'all_old' });
    return res.data;
  };
}