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
    // Track operation counts and successes
    const operationCounts = {
      furnitureCreated: 0,
      furnitureUpdated: 0,
      furnitureDeleted: 0,
      assignmentsCreated: 0,
      assignmentsUpdated: 0,
      assignmentsDeleted: 0,
      success: true
    };

    // Update chart if needed
    if (input.chart) {
      try {
        await DB.entities.Chart.patch({
          userId: ctx.userId,
          chartId: params.id,
        })
          .set({
            ...input.chart,
            updatedAt: Date.now(),
          })
          .go();
      } catch (error) {
        operationCounts.success = false;
        console.error('Failed to update chart:', error);
      }
    }

    // Create furniture
    if (input.furnitureToCreate && input.furnitureToCreate.length > 0) {
      for (const furniture of input.furnitureToCreate) {
        try {
          await DB.entities.Furniture.create({
            userId: ctx.userId,
            chartId: params.id,
            ...furniture,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          }).go();
          operationCounts.furnitureCreated++;
        } catch (error) {
          console.error('Failed to create furniture:', error);
        }
      }
    }

    // Update furniture
    if (input.furnitureToUpdate && input.furnitureToUpdate.length > 0) {
      for (const { id, data } of input.furnitureToUpdate) {
        try {
          await DB.entities.Furniture.patch({
            userId: ctx.userId,
            chartId: params.id,
            id,
          })
            .set({
              ...data,
              updatedAt: Date.now(),
            })
            .go();
          operationCounts.furnitureUpdated++;
        } catch (error) {
          console.error('Failed to update furniture:', error);
        }
      }
    }

    // Delete furniture
    if (input.furnitureToDelete && input.furnitureToDelete.length > 0) {
      for (const furnitureId of input.furnitureToDelete) {
        try {
          await DB.entities.Furniture.remove({
            userId: ctx.userId,
            chartId: params.id,
            id: furnitureId,
          }).go();
          operationCounts.furnitureDeleted++;
        } catch (error) {
          console.error('Failed to delete furniture:', error);
        }
      }
    }

    // Create assignments
    if (input.assignmentsToCreate && input.assignmentsToCreate.length > 0) {
      for (const assignment of input.assignmentsToCreate) {
        try {
          await DB.entities.Assignment.create({
            userId: ctx.userId,
            chartId: params.id,
            ...assignment,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          }).go();
          operationCounts.assignmentsCreated++;
        } catch (error) {
          console.error('Failed to create assignment:', error);
        }
      }
    }

    // Update assignments
    if (input.assignmentsToUpdate && input.assignmentsToUpdate.length > 0) {
      for (const { id, personId } of input.assignmentsToUpdate) {
        try {
          await DB.entities.Assignment.patch({
            userId: ctx.userId,
            chartId: params.id,
            id,
          })
            .set({
              personId,
              updatedAt: Date.now(),
            })
            .go();
          operationCounts.assignmentsUpdated++;
        } catch (error) {
          console.error('Failed to update assignment:', error);
        }
      }
    }

    // Delete assignments
    if (input.assignmentsToDelete && input.assignmentsToDelete.length > 0) {
      for (const assignmentId of input.assignmentsToDelete) {
        try {
          await DB.entities.Assignment.remove({
            userId: ctx.userId,
            chartId: params.id,
            id: assignmentId,
          }).go();
          operationCounts.assignmentsDeleted++;
        } catch (error) {
          console.error('Failed to delete assignment:', error);
        }
      }
    }

    // Fetch the updated chart data
    const updatedChart = await DB.collections
      .charts({
        userId: ctx.userId,
        chartId: params.id,
      })
      .go();

    return {
      transaction: {
        success: operationCounts.success,
        furnitureCreated: operationCounts.furnitureCreated,
        furnitureUpdated: operationCounts.furnitureUpdated,
        furnitureDeleted: operationCounts.furnitureDeleted,
        assignmentsCreated: operationCounts.assignmentsCreated,
        assignmentsUpdated: operationCounts.assignmentsUpdated,
        assignmentsDeleted: operationCounts.assignmentsDeleted,
      },
      chart: transformChartResponse(updatedChart),
    };
  };
}
