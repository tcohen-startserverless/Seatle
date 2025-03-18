import { User } from './entity';
import { UserSchemas } from './schema';

export namespace UserService {
  export const create = async (data: UserSchemas.Types.CreateUserInput) => {
    const res = await User.create(data).go();
    return res.data;
  };

  export const getById = async ({ id }: { id: string }) => {
    const res = await User.get({ id }).go();
    return res.data;
  };

  export const getByEmail = async ({ email }: { email: string }) => {
    const res = await User.query.byEmail({ email }).go();
    return res.data.pop();
  };

  export const patch = async ({
    id,
    data,
  }: {
    id: string;
    data: UserSchemas.Types.PatchUserInput;
  }) => {
    const res = await User.patch({ id }).set(data).go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async ({ id }: { id: string }) => {
    return await User.delete({ id }).go();
  };

  export const list = async ({ cursor }: { cursor?: string } = {}) => {
    return await User.query.primary({}).go({ cursor });
  };
}
