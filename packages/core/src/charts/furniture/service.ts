import { FurnitureSchemas } from './schema';
import { DB } from '@core/dynamo';
import { Schemas } from '@core/schema';

export namespace FurnitureService {
  export const create = async (
    ctx: Schemas.Types.Context,
    input: FurnitureSchemas.Types.Create
  ) => {
    const res = await DB.entities.Furniture.create({
      userId: ctx.userId,
      ...input,
    }).go();
    return res.data;
  };

  export const get = async (
    ctx: Schemas.Types.Context,
    input: FurnitureSchemas.Types.NestedParams
  ) => {
    const res = await DB.entities.Furniture.get({ userId: ctx.userId, ...input }).go();
    return res.data;
  };

  export const listByChart = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Furniture.query
      .primary({ userId: ctx.userId, chartId: params.id })
      .go(pagination);
    return res;
  };

  export const patch = async (
    ctx: Schemas.Types.Context,
    params: FurnitureSchemas.Types.NestedParams,
    input: FurnitureSchemas.Types.Patch
  ) => {
    const res = await DB.entities.Furniture.patch({ userId: ctx.userId, ...params })
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async (
    ctx: Schemas.Types.Context,
    params: FurnitureSchemas.Types.NestedParams
  ) => {
    const res = await DB.entities.Furniture.remove({
      userId: ctx.userId,
      chartId: params.chartId,
      id: params.id,
    }).go({ response: 'all_old' });
    return res.data;
  };
}
