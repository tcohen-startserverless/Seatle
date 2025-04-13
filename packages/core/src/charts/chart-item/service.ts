import { DB } from '@core/dynamo';
import { ChartItemSchemas } from './schema';

export namespace ChartItemService {
  export const create = async (input: ChartItemSchemas.Types.CreateInput) => {
    const res = await DB.entities.ChartItem.create(input).go();
    return res.data;
  };

  export const get = async (input: ChartItemSchemas.Types.GetInput) => {
    const res = await DB.entities.ChartItem.get(input).go();
    return res.data;
  };

  export const listByChart = async (input: ChartItemSchemas.Types.ListByChartInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.ChartItem.query.byChart(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: ChartItemSchemas.Types.GetInput,
    input: ChartItemSchemas.Types.PatchInput
  ) => {
    const res = await DB.entities.ChartItem.patch(params)
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (input: ChartItemSchemas.Types.DeleteInput) => {
    const res = await DB.entities.ChartItem.remove(input).go();
    return res.data;
  };
}