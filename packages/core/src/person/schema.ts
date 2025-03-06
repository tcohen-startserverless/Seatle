import * as v from 'valibot';

export namespace StudentSchemas {
  export const CreateInput = v.object({
    firstName: v.string(),
    lastName: v.string(),
  });

  export const PatchInput = v.object({
    firstName: v.string(),
    lastName: v.string(),
  });

  export const GetInput = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export const ListInput = v.object({
    userID: v.string(),
    cursor: v.optional(v.string()),
  });

  export const DeleteInput = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export namespace Types {
    export type CreateInput = v.InferInput<typeof CreateInput>;
    export type PatchInput = v.InferInput<typeof PatchInput>;
    export type GetInput = v.InferInput<typeof GetInput>;
    export type ListInput = v.InferInput<typeof ListInput>;
    export type DeleteInput = v.InferInput<typeof DeleteInput>;
  }
}
