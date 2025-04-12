import * as v from 'valibot';

export namespace Schemas {
  export const Context = v.object({
    userId: v.string(),
  });

  export const Params = v.object({
    id: v.string(),
  });

  export const Pagination = v.partial(
    v.object({
      cursor: v.optional(v.string()),
      limit: v.optional(v.number()),
      pages: v.union([v.literal('all'), v.number()]),
    })
  );

  export namespace Types {
    export type Context = v.InferInput<typeof Context>;
    export type Params = v.InferInput<typeof Params>;
    export type Pagination = v.InferInput<typeof Pagination>;
  }
}
