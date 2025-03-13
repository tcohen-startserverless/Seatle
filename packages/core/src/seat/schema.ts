import * as v from 'valibot';

export namespace SeatSchemas {
  export const CreateInput = v.object({
    id: v.optional(v.string()),
    userId: v.string(),
    chartId: v.string(),
    personId: v.optional(v.string()),
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
  });

  export const PatchInput = v.object({
    personId: v.optional(v.string()),
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
  });

  export const GetInput = v.object({
    userId: v.string(),
    chartId: v.string(),
    id: v.string(),
  });

  export const ListByChartInput = v.object({
    userId: v.string(),
    chartId: v.string(),
    cursor: v.optional(v.string()),
  });

  export const ListByPersonInput = v.object({
    userId: v.string(),
    personId: v.optional(v.string()),
    chartId: v.optional(v.string()),
    cursor: v.optional(v.string()),
  });

  export namespace Types {
    export type CreateInput = v.InferInput<typeof CreateInput>;
    export type PatchInput = v.InferInput<typeof PatchInput>;
    export type GetInput = v.InferInput<typeof GetInput>;
    export type ListByChartInput = v.InferInput<typeof ListByChartInput>;
    export type ListByPersonInput = v.InferInput<typeof ListByPersonInput>;
  }
}
