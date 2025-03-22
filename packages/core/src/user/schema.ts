import * as v from 'valibot';

export namespace UserSchemas {
  const Status = v.union([
    v.literal('ACTIVE'),
    v.literal('INACTIVE'),
    v.literal('PENDING'),
    v.literal('SUSPENDED'),
  ]);

  const Role = v.union([v.literal('USER'), v.literal('ADMIN')]);

  export const Create = v.object({
    email: v.pipe(v.string('email is required'), v.email()),
    firstName: v.optional(v.string('firstName is required')),
    lastName: v.optional(v.string('lastName is required')),
    role: Role,
    status: v.optional(Status),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  });

  export const Patch = v.partial(Create);

  export const GetUserByEmail = v.object({
    email: v.pipe(v.string('email is required'), v.email()),
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type GetUserByEmail = v.InferInput<typeof GetUserByEmail>;
  }
}
