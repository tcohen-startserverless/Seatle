import * as v from 'valibot';

export namespace PersonSchema {
  export const Create = v.object({
    listId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.pipe(v.string(), v.email())),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  });

  export const Patch = v.partial(Create);

  export const ListByName = v.object({
    lastName: v.optional(v.string()),
    firstName: v.optional(v.string()),
  });

  export const Delete = v.object({
    id: v.string(),
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type ListByName = v.InferInput<typeof ListByName>;
    export type Delete = v.InferInput<typeof Delete>;
  }
}
