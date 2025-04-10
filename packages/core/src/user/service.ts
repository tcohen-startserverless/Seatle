import { UserSchemas } from './schema';
import { DB } from '@core/dynamo';
import { Schemas } from '@core/schema';

export namespace UserService {
  export const create = async (data: UserSchemas.Types.Create) => {
    const res = await DB.entities.User.create(data).go();
    return res.data;
  };

  export const getOrCreateUser = async (email: string) => {
    const user = await UserService.getByEmail(email);
    if (!user) {
      const newUser = await UserService.create({
        email,
        role: 'USER',
      });
      return newUser;
    }
    return user;
  };

  export const getById = async (ctx: Schemas.Types.Context) => {
    const res = await DB.entities.User.get({ id: ctx.userId }).go();
    return res.data;
  };

  export const getByEmail = async (email: string) => {
    const res = await DB.entities.User.query.byEmail({ email }).go();
    return res.data[0] || null;
  };

  export const patch = async (
    ctx: Schemas.Types.Context,
    data: UserSchemas.Types.Patch
  ) => {
    const res = await DB.entities.User.patch({ id: ctx.userId })
      .set(data)
      .go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async (ctx: Schemas.Types.Context) => {
    return await DB.entities.User.delete({ id: ctx.userId }).go();
  };

  export const list = async ({ cursor }: { cursor?: string } = {}) => {
    return await DB.entities.User.query.primary({}).go({ cursor });
  };
}
