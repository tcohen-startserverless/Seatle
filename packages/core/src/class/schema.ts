import * as v from 'valibot';

export namespace ClassSchemas {
  export const Create = v.object({
    schoolId: v.string(),
    name: v.string(),
    teacherId: v.string(),
    period: v.optional(v.string()),
    subject: v.optional(v.string()),
  });

  export const Patch = v.partial(v.omit(Create, ['schoolId', 'teacherId']));

  export const Update = v.object;

  export namespace Types {
    export type CreateInput = v.InferInput<typeof Create>;
    export type PatchInput = v.InferInput<typeof Patch>;
  }
}
