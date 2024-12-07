import { User } from './entity';
import { UserSchemas } from './schema';

export namespace UserService {
  export const create = async (data: UserSchemas.Types.CreateUserInput) => {
    const res = await User.create(data).go();
    return res.data;
  };

  export const getById = async ({ userId }: { userId: string }) => {
    const res = await User.get({ userId }).go();
    return res.data;
  };

  export const getByEmail = async ({ email }: { email: string }) => {
    const res = await User.query.byEmail({ email }).go();
    return res.data;
  };

  export const patch = async ({
    userId,
    data,
  }: {
    userId: string;
    data: UserSchemas.Types.PatchUserInput;
  }) => {
    const res = await User.patch({ userId }).set(data).go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async ({ userId }: { userId: string }) => {
    return await User.delete({ userId }).go();
  };

  export const list = async ({ cursor }: { cursor?: string } = {}) => {
    return await User.query.primary({}).go({ cursor });
  };

  // export const listBySchool = async ({
  //   schoolId,
  //   role,
  //   cursor,
  // }: {
  //   schoolId: string;
  //   role?: UserSchemas.Types.Role;
  //   cursor?: string;
  // }) => {
  //   const query = User.query.bySchool({ schoolId });
  //   if (role) {
  //     query.between({ role }, { role });
  //   }
  //   return await query.go({ cursor, pages: 5 });
  // };
}
