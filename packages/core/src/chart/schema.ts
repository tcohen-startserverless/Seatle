import * as v from 'valibot';

export namespace ChartSchemas {
  export const Create = v.object({
    name: v.string(),
    userId: v.string(),
    id: v.optional(v.string()),
  });

  export const Patch = v.partial(v.omit(Create, ['userId']));

  export const Update = v.object;

  export namespace Types {
    export type CreateInput = v.InferInput<typeof Create>;
    export type PatchInput = v.InferInput<typeof Patch>;
  }
}
