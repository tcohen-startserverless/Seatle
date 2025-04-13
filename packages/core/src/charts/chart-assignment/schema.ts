import * as v from 'valibot';

export namespace ChartAssignmentSchemas {
  export const Create = v.object({
    chartId: v.string(),
    userId: v.string(),
    chartItemId: v.string(),
    personId: v.string(),
    seatIndex: v.optional(v.number()),
    id: v.optional(v.string()),
  });

  export const Patch = v.object({
    chartItemId: v.optional(v.string()),
    personId: v.optional(v.string()),
    seatIndex: v.optional(v.number()),
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

  export const ListByChartItemInput = v.object({
    userId: v.string(),
    chartId: v.string(),
    chartItemId: v.string(),
    cursor: v.optional(v.string()),
  });

  export const ListByPersonInput = v.object({
    userId: v.string(),
    personId: v.string(),
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
    export type ListByChartItemInput = v.InferInput<typeof ListByChartItemInput>;
    export type ListByPersonInput = v.InferInput<typeof ListByPersonInput>;
    export type DeleteInput = v.InferInput<typeof DeleteInput>;
  }
}