import { UserSchemas } from './schema';
import { DB } from '@core/dynamo';

export namespace UserService {
  export const create = async (data: UserSchemas.Types.Create) => {
    const res = await DB.entities.User.create(data).go();
    return res.data;
  };

  export const getById = async ({ id }: { id: string }) => {
    const res = await DB.entities.User.get({ id }).go();
    return res.data;
  };

  export const getByEmail = async (email: string) => {
    const res = await DB.entities.User.query.byEmail({ email }).go();
    return res.data[0] || null;
  };

  export const patch = async ({
    id,
    data,
  }: {
    id: string;
    data: UserSchemas.Types.Patch;
  }) => {
    const res = await DB.entities.User.patch({ id })
      .set(data)
      .go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async ({ id }: { id: string }) => {
    return await DB.entities.User.delete({ id }).go();
  };

  export const list = async ({ cursor }: { cursor?: string } = {}) => {
    return await DB.entities.User.query.primary({}).go({ cursor });
  };
}
