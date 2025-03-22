import { DB } from '@core/dynamo';
import { ListSchemas } from './schema';

export namespace ListService {
  export const create = async (input: ListSchemas.Types.Create) => {
    const res = await DB.entities.ContactList.create(input).go();
    return res.data;
  };

  export const get = async (input: ListSchemas.Types.Get) => {
    const res = await DB.entities.ContactList.get(input).go();
    return res.data;
  };

  export const list = async (input: ListSchemas.Types.List) => {
    const { cursor, ...key } = input;
    DB.entities.ContactList.query;
    const res = await DB.entities.ContactList.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const listByStatus = async (input: ListSchemas.Types.ListByStatus) => {
    const { cursor, ...key } = input;
    const res = await DB.entities.ContactList.query.byStatus(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: ListSchemas.Types.Get,
    input: ListSchemas.Types.Patch
  ) => {
    const res = await DB.entities.ContactList.patch(params)
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go();
    return res.data;
  };

  export const remove = async (input: ListSchemas.Types.Delete) => {
    const res = await DB.entities.ContactList.remove(input).go();
    return res.data;
  };
}
