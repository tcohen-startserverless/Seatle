import { Seat } from './entity';
import { SeatSchemas } from './schema';

export namespace SeatService {
  export const create = async (input: SeatSchemas.Types.CreateInput) => {
    const res = await Seat.create(input).go();
    return res.data;
  };

  export const get = async (input: SeatSchemas.Types.GetInput) => {
    const { userId, seatingId, id } = input;
    const res = await Seat.get({ userId, seatingId, id }).go();
    return res.data;
  };

  export const list = async (input: SeatSchemas.Types.ListInput) => {
    const { cursor, userId } = input;
    const res = await Seat.query.primary({ userId }).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: SeatSchemas.Types.GetInput,
    input: SeatSchemas.Types.PatchInput
  ) => {
    const { userId, seatingId, id } = params;
    const res = await Seat.patch({ userId, seatingId, id }).set(input).go();
    return res.data;
  };

  export const remove = async (params: SeatSchemas.Types.GetInput) => {
    const { userId, seatingId, id } = params;
    const res = await Seat.remove({ userId, seatingId, id }).go();
    return res.data;
  };
}
