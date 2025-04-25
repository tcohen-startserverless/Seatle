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

  export const updateLayout = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    input: ChartSchemas.Types.UpdateLayoutInput
  ) => {
    const token = `update-layout-${Date.now()}`;

    const result = await DB.transaction
      .write(({ Chart, Furniture, Assignment }) => {
        const operations = [];

        if (input.chart) {
          operations.push(
            Chart.patch({
              userId: ctx.userId,
              chartId: params.id,
            })
              .set({
                ...input.chart,
                updatedAt: Date.now(),
              })
              .commit()
          );
        }

        if (input.furnitureToCreate && input.furnitureToCreate.length > 0) {
          for (const furniture of input.furnitureToCreate) {
            operations.push(
              Furniture.create({
                userId: ctx.userId,
                chartId: params.id,
                ...furniture,
                updatedAt: Date.now(),
                createdAt: Date.now(),
              }).commit()
            );
          }
        }

        if (input.furnitureToUpdate && input.furnitureToUpdate.length > 0) {
          for (const { id, data } of input.furnitureToUpdate) {
            operations.push(
              Furniture.patch({
                userId: ctx.userId,
                chartId: params.id,
                id,
              })
                .set({
                  ...data,
                  updatedAt: Date.now(),
                })
                .commit()
            );
          }
        }

        if (input.furnitureToDelete && input.furnitureToDelete.length > 0) {
          for (const furnitureId of input.furnitureToDelete) {
            operations.push(
              Furniture.remove({
                userId: ctx.userId,
                chartId: params.id,
                id: furnitureId,
              }).commit({ response: 'all_old' })
            );
          }
        }

        if (input.assignmentsToCreate && input.assignmentsToCreate.length > 0) {
          for (const assignment of input.assignmentsToCreate) {
            operations.push(
              Assignment.create({
                userId: ctx.userId,
                chartId: params.id,
                ...assignment,
                updatedAt: Date.now(),
                createdAt: Date.now(),
              }).commit()
            );
          }
        }

        if (input.assignmentsToUpdate && input.assignmentsToUpdate.length > 0) {
          for (const { id, personId } of input.assignmentsToUpdate) {
            operations.push(
              Assignment.patch({
                userId: ctx.userId,
                chartId: params.id,
                id,
              })
                .set({
                  personId,
                  updatedAt: Date.now(),
                })
                .commit()
            );
          }
        }

        if (input.assignmentsToDelete && input.assignmentsToDelete.length > 0) {
          for (const assignmentId of input.assignmentsToDelete) {
            operations.push(
              Assignment.remove({
                userId: ctx.userId,
                chartId: params.id,
                id: assignmentId,
              }).commit({ response: 'all_old' })
            );
          }
        }

        return operations;
      })
      .go({ token });

    const updatedChart = await DB.collections
      .charts({
        userId: ctx.userId,
        chartId: params.id,
      })
      .go();

    return {
      transaction: {
        success: !result.canceled,
        furnitureCreated: input.furnitureToCreate?.length || 0,
        furnitureUpdated: input.furnitureToUpdate?.length || 0,
        furnitureDeleted: input.furnitureToDelete?.length || 0,
        assignmentsCreated: input.assignmentsToCreate?.length || 0,
        assignmentsUpdated: input.assignmentsToUpdate?.length || 0,
        assignmentsDeleted: input.assignmentsToDelete?.length || 0,
      },
      chart: transformChartResponse(updatedChart),
    };
  };
}
