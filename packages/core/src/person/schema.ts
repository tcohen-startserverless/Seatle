import * as v from 'valibot';

export namespace PersonSchemas {
  export const CreateInput = v.object({
    userId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.pipe(v.string(), v.email())),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  });

  export const PatchInput = v.omit(CreateInput, ['userId']);

  export const GetInput = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export const ListInput = v.object({
    userId: v.string(),
    cursor: v.optional(v.string()),
  });

  export const ListByNameInput = v.object({
    userId: v.string(),
    lastName: v.optional(v.string()),
    firstName: v.optional(v.string()),
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
    export type ListByNameInput = v.InferInput<typeof ListByNameInput>;
    export type DeleteInput = v.InferInput<typeof DeleteInput>;
  }
}
