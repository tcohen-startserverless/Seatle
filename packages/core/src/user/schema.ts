import * as v from 'valibot';

export namespace UserSchemas {
  const Status = v.union([
    v.literal('ACTIVE'),
    v.literal('INACTIVE'),
    v.literal('PENDING'),
    v.literal('SUSPENDED'),
  ]);

  const Role = v.union([v.literal('TEACHER'), v.literal('ADMIN'), v.literal('STUDENT')]);

  export const CreateUserInput = v.object({
    email: v.pipe(v.string('email is required'), v.email()),
    firstName: v.string('firstName is required'),
    lastName: v.string('lastName is required'),
    schoolId: v.optional(v.string()),
    role: Role,
    status: v.optional(Status),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  });

  export const PatchUserInput = v.partial(CreateUserInput);

  export const GetUserByEmailInput = v.object({
    email: v.pipe(v.string('email is required'), v.email()),
  });

  export namespace Types {
    export type CreateUserInput = v.InferInput<typeof CreateUserInput>;
    export type PatchUserInput = v.InferInput<typeof PatchUserInput>;
    export type GetUserByEmailInput = v.InferInput<typeof GetUserByEmailInput>;
  }
}
