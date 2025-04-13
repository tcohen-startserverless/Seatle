import * as v from 'valibot';

export namespace ChartItemSchemas {
  export const Create = v.object({
    chartId: v.string(),
    userId: v.string(),
    type: v.union([v.literal('TABLE'), v.literal('CHAIR'), v.literal('OTHER')]),
    x: v.number(),
    y: v.number(),
    width: v.number(),
    height: v.number(),
    size: v.optional(v.number()),
    cells: v.optional(v.number()),
    properties: v.optional(v.record(v.string(), v.any())),
    id: v.optional(v.string()),
  });

  export const Patch = v.object({
    type: v.optional(v.union([v.literal('TABLE'), v.literal('CHAIR'), v.literal('OTHER')])),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    size: v.optional(v.number()),
    cells: v.optional(v.number()),
    properties: v.optional(v.record(v.string(), v.any())),
  });

  export const GetInput = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export const ListByChartInput = v.object({
    userId: v.string(),
    chartId: v.string(),
    cursor: v.optional(v.string()),
  });

  export const DeleteInput = v.object({
    userId: v.string(),
    id: v.string(),
  });

  export namespace Types {
    export type CreateInput = v.InferInput<typeof Create>;
    export type PatchInput = v.InferInput<typeof Patch>;
    export type GetInput = v.InferInput<typeof GetInput>;
    export type ListByChartInput = v.InferInput<typeof ListByChartInput>;
    export type DeleteInput = v.InferInput<typeof DeleteInput>;
  }
}