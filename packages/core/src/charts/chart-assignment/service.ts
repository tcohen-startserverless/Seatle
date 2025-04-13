import { DB } from '@core/dynamo';
import { ChartAssignmentSchemas } from './schema';

export namespace ChartAssignmentService {
  export const create = async (input: ChartAssignmentSchemas.Types.CreateInput) => {
    const res = await DB.entities.ChartAssignment.create(input).go();
    return res.data;
  };

  export const get = async (input: ChartAssignmentSchemas.Types.GetInput) => {
    const res = await DB.entities.ChartAssignment.get(input).go();
    return res.data;
  };

  export const listByChart = async (input: ChartAssignmentSchemas.Types.ListByChartInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.ChartAssignment.query.byChart(key).go({
      cursor,
    });
    return res;
  };

  export const listByChartItem = async (input: ChartAssignmentSchemas.Types.ListByChartItemInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.ChartAssignment.query.byChart({
      userId: key.userId,
      chartId: key.chartId,
      chartItemId: key.chartItemId,
    }).go({
      cursor,
    });
    return res;
  };

  export const listByPerson = async (input: ChartAssignmentSchemas.Types.ListByPersonInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.ChartAssignment.query.byPerson(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: ChartAssignmentSchemas.Types.GetInput,
    input: ChartAssignmentSchemas.Types.PatchInput
  ) => {
    const res = await DB.entities.ChartAssignment.patch(params)
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (input: ChartAssignmentSchemas.Types.DeleteInput) => {
    const res = await DB.entities.ChartAssignment.remove(input).go();
    return res.data;
  };
}