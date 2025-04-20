import { DB } from '@core/dynamo';
import { ChartSchemas } from './schema';
import { Schemas } from '@core/schema';
import { transformChartResponse } from '@core/charts/helpers';

export namespace ChartService {
  export const create = async (
    ctx: Schemas.Types.Context,
    input: ChartSchemas.Types.CreateInput
  ) => {
    const res = await DB.entities.Chart.create({
      userId: ctx.userId,
      ...input,
    }).go();
    return res.data;
  };

  export const get = async (ctx: Schemas.Types.Context, input: Schemas.Types.Params) => {
    const res = await DB.collections
      .charts({
        userId: ctx.userId,
        chartId: input.id,
      })
      .go();
    return transformChartResponse(res);
  };

  export const list = async (
    ctx: Schemas.Types.Context,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Chart.query
      .primary({
        userId: ctx.userId,
      })
      .go(pagination);
    return res;
  };

  export const listByStatus = async (
    ctx: Schemas.Types.Context,
    input: ChartSchemas.Types.ListByStatus,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Chart.query
      .byStatus({
        userId: ctx.userId,
        status: input.status,
      })
      .go(pagination);
    return res;
  };

  export const patch = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    input: ChartSchemas.Types.PatchInput
  ) => {
    const res = await DB.entities.Chart.patch({
      userId: ctx.userId,
      chartId: params.id,
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
    params: Schemas.Types.Params
  ) => {
    const res = await DB.entities.Chart.remove({
      userId: ctx.userId,
      chartId: params.id,
    }).go();
    return res.data;
  };
}
