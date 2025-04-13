import { DB } from '@core/dynamo';
import { ChartSchemas } from './schema';
import { ChartItemService } from '../chart-item';
import { ChartAssignmentService } from '../chart-assignment';
import { ListService } from '@core/list';
import { ChartItem as ChartItemEntity } from '../chart-item/entity';
import { ChartAssignmentEntity } from '../chart-assignment/entity';
import { ListItem } from '@core/list';
import { ChartItem } from './entity';

export type CompleteChart = ChartItem & {
  items: ChartItemEntity[];
  assignments: ChartAssignmentEntity[];
  lists: ListItem[];
};

export namespace ChartService {
  export const create = async (input: ChartSchemas.Types.CreateInput) => {
    const res = await DB.entities.Chart.create(input).go();
    return res.data;
  };

  export const get = async (input: ChartSchemas.Types.GetInput): Promise<CompleteChart | null> => {
    const res = await DB.entities.Chart.get(input).go();
    
    if (!res.data) return null;
    
    // Get chart items, assignments, and associated lists
    const [items, assignments, listsData] = await Promise.all([
      ChartItemService.listByChart({
        userId: input.userId,
        chartId: input.id,
      }),
      ChartAssignmentService.listByChart({
        userId: input.userId,
        chartId: input.id,
      }),
      res.data.listIds && res.data.listIds.length > 0 
        ? Promise.all(res.data.listIds.map(listId => 
            ListService.get({ userId: input.userId }, { id: listId })
          ))
        : Promise.resolve([])
    ]);
    
    return {
      ...res.data,
      items: items.data || [],
      assignments: assignments.data || [],
      lists: listsData.filter(Boolean) as ListItem[],
    };
  };

  export const list = async (input: ChartSchemas.Types.ListInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.Chart.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const listByStatus = async (input: ChartSchemas.Types.ListByStatusInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.Chart.query.byStatus(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: ChartSchemas.Types.GetInput,
    input: ChartSchemas.Types.PatchInput
  ) => {
    const res = await DB.entities.Chart.patch(params)
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (input: ChartSchemas.Types.DeleteInput) => {
    const res = await DB.entities.Chart.remove(input).go();
    return res.data;
  };
}
