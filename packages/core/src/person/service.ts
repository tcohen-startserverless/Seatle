import { PersonSchema } from './schema';
import { Schemas } from '@core/schema';
import { DB } from '@core/dynamo';

export namespace PersonService {
  export const create = async (
    ctx: Schemas.Types.Context,
    input: PersonSchema.Types.Create
  ) => {
    const res = await DB.entities.Person.create({
      ...input,
      userId: ctx.userId,
    }).go();
    return res.data;
  };

  export const list = async (
    ctx: Schemas.Types.Context,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Person.query
      .primary({
        userId: ctx.userId,
      })
      .go(pagination);
    return res;
  };

  export const listByName = async (
    ctx: Schemas.Types.Context,
    input: Omit<PersonSchema.Types.ListByName, 'userId'>,
    pagination: Schemas.Types.Pagination
  ) => {
    const res = await DB.entities.Person.query
      .byName({
        ...input,
        userId: ctx.userId,
      })
      .go(pagination);
    return res;
  };

  export const get = async (ctx: Schemas.Types.Context, params: Schemas.Types.Params) => {
    const res = await DB.entities.Person.get({
      userId: ctx.userId,
      id: params.id,
    }).go();
    return res.data;
  };

  export const patch = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params,
    input: PersonSchema.Types.Patch
  ) => {
    const res = await DB.entities.Person.patch({
      userId: ctx.userId,
      id: params.id,
    })
      .set({
        ...input,
        updatedAt: Date.now(),
      })
      .go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async (
    ctx: Schemas.Types.Context,
    params: Schemas.Types.Params
  ) => {
    const res = await DB.entities.Person.remove({
      userId: ctx.userId,
      id: params.id,
    }).go();
    return res.data;
  };
}
