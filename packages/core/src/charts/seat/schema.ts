import * as v from 'valibot';

export namespace SeatSchemas {
  const SeatTypes = v.union([
    v.literal('TABLE'),
    v.literal('DESK'),
    v.literal('CHAIR'),
    v.literal('OTHER'),
  ]);

  export const Create = v.object({
    id: v.optional(v.string()),
    userId: v.string(),
    chartId: v.string(),
    personId: v.optional(v.string()),
    x: v.number(),
    y: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    rotation: v.optional(v.number()),
    type: v.optional(SeatTypes),
    label: v.optional(v.string()),
    notes: v.optional(v.string()),
  });

  export const Patch = v.partial(v.omit(Create, ['chartId', 'id', 'userId']));

  export const Get = v.object({
    userId: v.string(),
    chartId: v.string(),
    id: v.string(),
  });

  export const ListByChart = v.object({
    ...Get.entries,
    cursor: v.optional(v.string()),
  });

  export const ListByPerson = v.object({
    userId: v.string(),
    personId: v.optional(v.string()),
    chartId: v.optional(v.string()),
    cursor: v.optional(v.string()),
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type Get = v.InferInput<typeof Get>;
    export type ListByChart = v.InferInput<typeof ListByChart>;
    export type ListByPerson = v.InferInput<typeof ListByPerson>;
  }
}
