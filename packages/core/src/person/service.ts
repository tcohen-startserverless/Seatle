import { Student } from './entity';
import { StudentSchemas } from './schema';

export namespace StudentService {
  export const create = async (input: StudentSchemas.Types.CreateInput) => {
    const res = await Student.create(input).go();
    return res.data;
  };

  export const list = async (input: StudentSchemas.Types.ListInput) => {
    const { cursor, ...key } = input;
    const res = await Student.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const get = async (input: StudentSchemas.Types.GetInput) => {
    const res = await Student.get(input).go();
    return res.data;
  };

  export const patch = async (
    params: StudentSchemas.Types.GetInput,
    input: StudentSchemas.Types.PatchInput
  ) => {
    const res = await Student.patch(params).set(input).go();
    return res.data;
  };

  export const remove = async (input: StudentSchemas.Types.DeleteInput) => {
    const res = await Student.remove(input).go();
    return res.data;
  };
}
