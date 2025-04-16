import * as v from 'valibot';

export namespace SeatingSchemas {
  export const Create = v.object({
    id: v.optional(v.string()),
    chartId: v.string(),
    name: v.string(),
    rows: v.number(),
    columns: v.number(),
  });

  export const Key = v.object({
    chartId: v.string(),
  });
  export const Patch = v.partial(v.omit(Create, ['id']));

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type Key = v.InferInput<typeof Key>;
  }
}
