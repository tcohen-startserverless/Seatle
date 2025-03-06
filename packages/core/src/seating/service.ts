import { Seating } from './entity';
import { SeatingSchemas } from './schema';

export namespace SeatingService {
  export const create = async (input: SeatingSchemas.Types.CreateInput) => {
    const res = await Seating.create(input).go();
    return res.data;
  };

  export const get = async (input: SeatingSchemas.Types.GetInput) => {
    const res = await Seating.get(input).go();
    return res.data;
  };

  export const list = async (input: SeatingSchemas.Types.ListInput) => {
    const { cursor, ...key } = input;
    const res = await Seating.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: SeatingSchemas.Types.GetInput,
    input: SeatingSchemas.Types.PatchInput
  ) => {
    const res = await Seating.patch(params).set(input).go();
    return res.data;
  };

  export const remove = async (params: SeatingSchemas.Types.GetInput) => {
    const res = await Seating.remove(params).go();
    return res.data;
  };
}
