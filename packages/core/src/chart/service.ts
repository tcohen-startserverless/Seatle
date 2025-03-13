import { Chart } from './entity';
import { ChartSchemas } from './schema';

export namespace ChartService {
  export const create = async (input: ChartSchemas.Types.CreateInput) => {
    const res = await Chart.create(input).go();
    return res.data;
  };

  export const get = async (input: ChartSchemas.Types.GetInput) => {
    const res = await Chart.get(input).go();
    return res.data;
  };

  export const list = async (input: ChartSchemas.Types.ListInput) => {
    const { cursor, ...key } = input;
    const res = await Chart.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const listByStatus = async (input: ChartSchemas.Types.ListByStatusInput) => {
    const { cursor, ...key } = input;
    const res = await Chart.query.byStatus(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: ChartSchemas.Types.GetInput,
    input: ChartSchemas.Types.PatchInput
  ) => {
    const res = await Chart.patch(params)
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (input: ChartSchemas.Types.DeleteInput) => {
    const res = await Chart.remove(input).go();
    return res.data;
  };
}
