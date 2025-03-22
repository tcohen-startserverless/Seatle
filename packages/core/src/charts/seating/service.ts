import { DB } from '@core/dynamo';
import { SeatingSchemas } from './schema';

export namespace SeatingService {
  export const create = async (input: SeatingSchemas.Types.Create) => {
    const res = await DB.entities.Seating.create(input).go();
    return res.data;
  };

  export const get = async (input: SeatingSchemas.Types.Get) => {
    const res = await DB.entities.Seating.get(input).go();
    return res.data;
  };

  export const list = async (input: SeatingSchemas.Types.List) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.Seating.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: SeatingSchemas.Types.Get,
    input: SeatingSchemas.Types.Patch
  ) => {
    const res = await DB.entities.Seating.patch(params).set(input).go();
    return res.data;
  };

  export const remove = async (params: SeatingSchemas.Types.Get) => {
    const res = await DB.entities.Seating.remove(params).go();
    return res.data;
  };
}
