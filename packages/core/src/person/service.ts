import { Person } from './entity';
import { PersonSchemas } from './schema';

export namespace PersonService {
  export const create = async (input: PersonSchemas.Types.CreateInput) => {
    const res = await Person.create(input).go();
    return res.data;
  };

  export const list = async (input: PersonSchemas.Types.ListInput) => {
    const { cursor, ...key } = input;
    const res = await Person.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const listByName = async (input: PersonSchemas.Types.ListByNameInput) => {
    const { cursor, ...key } = input;
    const res = await Person.query.byName(key).go({
      cursor,
    });
    return res;
  };

  export const get = async (input: PersonSchemas.Types.GetInput) => {
    const res = await Person.get(input).go();
    return res.data;
  };

  export const patch = async (
    params: PersonSchemas.Types.GetInput,
    input: PersonSchemas.Types.PatchInput
  ) => {
    const res = await Person.patch(params).set(input).go();
    return res.data;
  };

  export const remove = async (input: PersonSchemas.Types.DeleteInput) => {
    const res = await Person.remove(input).go();
    return res.data;
  };
}
