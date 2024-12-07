import { School, SchoolSchemas } from '@core/school';

export namespace SchoolService {
  export const create = async (data: SchoolSchemas.Types.CreateSchoolInput) => {
    const res = await School.create(data).go();
    return res.data;
  };

  export const getById = async (schoolId: string) => {
    const res = await School.get({ schoolId }).go();
    return res.data;
  };

  export const patch = async (schoolId: string, data: SchoolSchemas.Types.PatchSchoolInput) => {
    const res = await School.patch({ schoolId }).set(data).go({ response: 'all_new' });
    return res.data;
  };

  export const remove = async (schoolId: string) => {
    return await School.delete({ schoolId }).go();
  };

  export const list = async (cursor?: string) => {
    return await School.query.primary({}).go({ cursor });
  };
}
