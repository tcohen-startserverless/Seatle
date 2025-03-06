import { useProvider } from '.sst/platform/src/components/aws/helpers/provider';
import * as v from 'valibot';

export namespace SeatingSchemas {
  export const CreateInput = v.object({
    userId: v.string(),
    id: v.optional(v.string()),
    name: v.string(),
    rows: v.number(),
    columns: v.number(),
  });

  export const PatchInput = v.partial(v.omit(CreateInput, ['id']));

  export const GetInput = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export const ListInput = v.object({
    schoolId: v.string(),
    classId: v.string(),
    cursor: v.optional(v.string()),
  });

  export namespace Types {
    export type CreateInput = v.InferInput<typeof CreateInput>;
    export type PatchInput = v.InferInput<typeof PatchInput>;
    export type GetInput = v.InferInput<typeof GetInput>;
    export type ListInput = v.InferInput<typeof ListInput>;
  }
}
