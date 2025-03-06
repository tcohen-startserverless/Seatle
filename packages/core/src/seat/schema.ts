import * as v from 'valibot';

export namespace SeatSchemas {
  export const CreateInput = v.object({
    id: v.optional(v.string()),
    userId: v.string(),
    personId: v.optional(v.string()),
    seatingId: v.string(),
    x: v.number(),
    y: v.number(),
    label: v.optional(v.string()),
    size: v.optional(v.number()),
  });

  export const PatchInput = v.partial(v.omit(CreateInput, ['id', 'userId', 'seatingId']));

  export const GetInput = v.object({
    userId: v.string(),
    seatingId: v.string(),
    id: v.string(),
  });

  export const ListInput = v.object({
    userId: v.string(),
    cursor: v.optional(v.string()),
  });

  export namespace Types {
    export type CreateInput = v.InferInput<typeof CreateInput>;
    export type PatchInput = v.InferInput<typeof PatchInput>;
    export type GetInput = v.InferInput<typeof GetInput>;
    export type ListInput = v.InferInput<typeof ListInput>;
  }
}
