import { PersonSchema } from './schema';
import { DB } from '@core/dynamo';

export namespace PersonService {
  export const create = async (input: PersonSchema.Types.CreateInput) => {
    const res = await DB.entities.Person.create(input).go();
    return res.data;
  };

  export const list = async (input: PersonSchema.Types.ListInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.Person.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const listByName = async (input: PersonSchema.Types.ListByNameInput) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.Person.query.byName(key).go({
      cursor,
    });
    return res;
  };

  export const get = async (input: PersonSchema.Types.GetInput) => {
    const res = await DB.entities.Person.get(input).go();
    return res.data;
  };

  export const patch = async (
    params: PersonSchema.Types.GetInput,
    input: PersonSchema.Types.PatchInput
  ) => {
    const res = await DB.entities.Person.patch(params).set(input).go();
    return res.data;
  };

  export const remove = async (input: PersonSchema.Types.DeleteInput) => {
    const res = await DB.entities.Person.remove(input).go();
    return res.data;
  };
}
