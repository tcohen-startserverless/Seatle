import { Class, ClassItem } from './entity';
import { ClassSchemas } from './schema';

export class ClassService {
  static async create(input: ClassSchemas.Types.CreateInput) {
    const res = await Class.create(input).go();
    return res.data;
  }

  static async getBySchool(schoolId: string): Promise<ClassItem[]> {
    const res = await Class.query
      .primary({ schoolId })
      .where(({ status }, { eq }) => eq(status, 'ACTIVE'))
      .go();
    return res.data;
  }

  static async getByTeacher(teacherId: string): Promise<ClassItem[]> {
    const res = await Class.query
      .byTeacher({ teacherId })
      .where(({ status }, { eq }) => eq(status, 'ACTIVE'))
      .go();
    return res.data;
  }
}
