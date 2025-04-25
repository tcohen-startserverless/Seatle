import * as v from 'valibot';
import { Schemas } from '@core/schema';

export namespace FurnitureSchemas {
  const FurnitureTypes = v.union([
    v.literal('TABLE'),
    v.literal('DESK'),
    v.literal('CHAIR'),
    v.literal('OTHER'),
  ]);

  export const Create = v.object({
    id: v.optional(v.string()),
    chartId: v.string(),
    x: v.number(),
    y: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    rotation: v.optional(v.number()),
    type: v.optional(FurnitureTypes),
    label: v.optional(v.string()),
    notes: v.optional(v.string()),
  });

  export const Patch = v.partial(Create);

  export const ChartIdParam = v.object({
    chartId: v.string(),
  });

  export const NestedParams = v.object({
    ...Schemas.Params.entries,
    ...ChartIdParam.entries,
  });

  export const Key = v.object({
    chartId: v.string(),
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type ChartIdParam = v.InferInput<typeof ChartIdParam>;
    export type NestedParams = v.InferInput<typeof NestedParams>;
    export type Key = v.InferInput<typeof Key>;
  }
}