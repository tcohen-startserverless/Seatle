import * as v from 'valibot';

export namespace SeatingSchemas {
  export const Create = v.object({
    userId: v.string(),
    id: v.optional(v.string()),
    name: v.string(),
    rows: v.number(),
    columns: v.number(),
  });

  export const Patch = v.partial(v.omit(Create, ['id']));

  export const Get = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export const List = v.object({
    userId: v.string(),
    cursor: v.optional(v.string()),
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type Get = v.InferInput<typeof Get>;
    export type List = v.InferInput<typeof List>;
  }
}
