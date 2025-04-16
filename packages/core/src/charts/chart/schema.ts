import * as v from 'valibot';

export namespace ChartSchemas {
  export const Create = v.object({
    name: v.string(),
    description: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    listId: v.string(),
    id: v.optional(v.string()),
  });

  export const Patch = v.object({
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    listId: v.optional(v.string()),
    status: v.optional(v.union([v.literal('ACTIVE'), v.literal('ARCHIVED')])),
  });

  export const ListByStatus = v.object({
    status: v.optional(v.union([v.literal('ACTIVE'), v.literal('ARCHIVED')])),
  });

  export namespace Types {
    export type CreateInput = v.InferInput<typeof Create>;
    export type PatchInput = v.InferInput<typeof Patch>;
    export type ListByStatus = v.InferInput<typeof ListByStatus>;
  }
}
