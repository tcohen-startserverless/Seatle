import { Seat } from './entity';
import { SeatSchemas } from './schema';

export namespace SeatService {
  export const create = async (input: SeatSchemas.Types.CreateInput) => {
    const res = await Seat.create(input).go();
    return res.data;
  };

  export const bulkCreate = async (inputs: SeatSchemas.Types.CreateInput[]) => {
    if (inputs.length === 0) return [];

    const results = await Promise.all(inputs.map((input) => Seat.create(input).go()));

    return results.map((res) => res.data);
  };

  export const get = async (input: SeatSchemas.Types.GetInput) => {
    const { userId, chartId, id } = input;
    const res = await Seat.get({ userId, chartId, id }).go();
    return res.data;
  };

  export const listByChart = async (input: SeatSchemas.Types.ListByChartInput) => {
    const { cursor, userId, chartId } = input;
    const res = await Seat.query.byChart({ userId, chartId }).go({
      cursor,
    });
    return res;
  };

  export const listByPerson = async (input: SeatSchemas.Types.ListByPersonInput) => {
    const { cursor, userId, personId, chartId } = input;
    const query = personId
      ? Seat.query.byPerson({ userId, personId })
      : Seat.query.primary({ userId });

    if (chartId) {
      query.where(({ chartId: c }, { eq }) => eq(c, chartId));
    }

    const res = await query.go({
      cursor,
    });

    return res;
  };

  export const patch = async (
    params: SeatSchemas.Types.GetInput,
    input: SeatSchemas.Types.PatchInput
  ) => {
    const { userId, chartId, id } = params;
    const res = await Seat.patch({ userId, chartId, id })
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const assignPerson = async (
    params: SeatSchemas.Types.GetInput,
    personId: string
  ) => {
    const { userId, chartId, id } = params;
    const res = await Seat.patch({ userId, chartId, id })
      .set({
        personId,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (params: SeatSchemas.Types.GetInput) => {
    const { userId, chartId, id } = params;
    const res = await Seat.remove({ userId, chartId, id }).go();
    return res.data;
  };

  // export const removeAllFromChart = async (userId: string, chartId: string) => {
  //   const seats = await Seat.query.byChart({ userId, chartId }).go();
  //   if (seats.data.length === 0) return [];
  //   const results = await Promise.all(
  //     seats.data.map((seat) => Seat.remove({ userId, chartId, id: seat.id }).go())
  //   );
  //   return results.map((res) => res.data);
  // };
}
