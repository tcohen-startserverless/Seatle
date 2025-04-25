import * as v from 'valibot';
import { Schemas } from '@core/schema';

export namespace ChartSchemas {
  export const Create = v.object({
    name: v.string(),
    description: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    listId: v.string(),
    id: v.optional(v.string()),
  });

  export const Patch = v.object({
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    listId: v.optional(v.string()),
    status: v.optional(v.union([v.literal('ACTIVE'), v.literal('ARCHIVED')])),
  });

  const FurnitureIdParam = v.object({
    furnitureId: v.string(),
  });

  const AssignmentIdParams = v.object({
    assignmentId: v.string(),
  });

  export const NestedParams = v.object({
    ...Schemas.Params.entries,
    ...FurnitureIdParam.entries,
  });

  export const NestedAssignment = v.object({
    ...AssignmentIdParams.entries,
    ...Schemas.Params.entries,
  });

  export const ListByStatus = v.object({
    status: v.optional(v.union([v.literal('ACTIVE'), v.literal('ARCHIVED')])),
  });

  export const UpdateLayout = v.object({
    chart: v.optional(Patch),
    furnitureToCreate: v.optional(
      v.array(
        v.object({
          id: v.optional(v.string()),
          x: v.number(),
          y: v.number(),
          width: v.optional(v.number()),
          height: v.optional(v.number()),
          rotation: v.optional(v.number()),
          type: v.optional(
            v.union([
              v.literal('TABLE'),
              v.literal('DESK'),
              v.literal('CHAIR'),
              v.literal('OTHER'),
            ])
          ),
          label: v.optional(v.string()),
          notes: v.optional(v.string()),
        })
      )
    ),
    furnitureToUpdate: v.optional(
      v.array(
        v.object({
          id: v.string(),
          data: v.object({
            x: v.optional(v.number()),
            y: v.optional(v.number()),
            width: v.optional(v.number()),
            height: v.optional(v.number()),
            rotation: v.optional(v.number()),
            type: v.optional(
              v.union([
                v.literal('TABLE'),
                v.literal('DESK'),
                v.literal('CHAIR'),
                v.literal('OTHER'),
              ])
            ),
            label: v.optional(v.string()),
            notes: v.optional(v.string()),
          }),
        })
      )
    ),
    furnitureToDelete: v.optional(v.array(v.string())),
    assignmentsToCreate: v.optional(
      v.array(
        v.object({
          furnitureId: v.string(),
          personId: v.string(),
        })
      )
    ),
    assignmentsToUpdate: v.optional(
      v.array(
        v.object({
          id: v.string(),
          personId: v.string(),
        })
      )
    ),
    assignmentsToDelete: v.optional(v.array(v.string())),
  });

  export namespace Types {
    export type CreateInput = v.InferInput<typeof Create>;
    export type PatchInput = v.InferInput<typeof Patch>;
    export type ListByStatus = v.InferInput<typeof ListByStatus>;
    export type UpdateLayoutInput = v.InferInput<typeof UpdateLayout>;
  }
}
