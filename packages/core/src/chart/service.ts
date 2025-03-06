import { Chart, ChartItem } from './entity';
import { ChartSchemas } from './schema';

export namespace ChartService {
  export const create = async (input: ChartSchemas.Types.CreateInput) => {
    const res = await Chart.create(input).go();
    return res.data;
  };
}
