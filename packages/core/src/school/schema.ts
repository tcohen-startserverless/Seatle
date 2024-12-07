import * as v from 'valibot';

export namespace SchoolSchemas {
  const Status = v.union([
    v.literal('ACTIVE'),
    v.literal('INACTIVE'),
    v.literal('PENDING'),
    v.literal('SUSPENDED'),
  ]);

  export const CreateSchoolInput = v.object({
    name: v.string('name is required'),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: Status,
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  });

  export const PatchSchoolInput = v.partial(
    v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      phone: v.string(),
      status: Status,
    })
  );

  export namespace Types {
    export type CreateSchoolInput = v.InferInput<typeof CreateSchoolInput>;
    export type PatchSchoolInput = v.InferInput<typeof PatchSchoolInput>;
  }
}
