import * as v from 'valibot';

export namespace ListSchemas {
  const Status = v.union([v.literal('ACTIVE'), v.literal('ARCHIVED')]);
  export const Create = v.object({
    name: v.string(),
    userId: v.string(),
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

  export const Get = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export const List = v.object({
    userId: v.string(),
    cursor: v.nullish(v.string()),
  });

  export const ListByStatus = v.object({
    userId: v.string(),
    status: Status,
    cursor: v.optional(v.string()),
  });

  export const Delete = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type Get = v.InferInput<typeof Get>;
    export type List = v.InferInput<typeof List>;
    export type ListByStatus = v.InferInput<typeof ListByStatus>;
    export type Delete = v.InferInput<typeof Delete>;
  }
}
