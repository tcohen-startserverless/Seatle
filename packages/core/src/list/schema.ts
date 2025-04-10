import * as v from 'valibot';

export namespace ListSchemas {
  const Status = v.union([v.literal('ACTIVE'), v.literal('ARCHIVED')]);

  export const Create = v.object({
    name: v.string(),
    description: v.optional(v.string()),
    personIds: v.optional(v.array(v.string())),
    id: v.optional(v.string()),
  });

  export const Patch = v.object({
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    personIds: v.optional(v.array(v.string())),
    status: v.optional(Status),
  });

  export const ListByStatus = v.object({
    status: Status,
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type ListByStatus = v.InferInput<typeof ListByStatus>;
  }
}
