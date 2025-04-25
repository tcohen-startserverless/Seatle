import * as v from 'valibot';
import { Schemas } from '@core/schema';

export namespace AssignmentSchemas {
  export const Create = v.object({
    chartId: v.string(),
    furnitureId: v.string(),
    personId: v.string(),
  });

  export const Patch = v.object({
    personId: v.optional(v.string()),
  });

  export const ListByChart = v.object({
    chartId: v.string(),
  });

  export const ListByPerson = v.object({
    personId: v.string(),
  });

  export const ListByFurniture = v.object({
    furnitureId: v.string(),
  });

  export namespace Types {
    export type Create = v.InferInput<typeof Create>;
    export type Patch = v.InferInput<typeof Patch>;
    export type ListByChart = v.InferInput<typeof ListByChart>;
    export type ListByPerson = v.InferInput<typeof ListByPerson>;
    export type ListByFurniture = v.InferInput<typeof ListByFurniture>;
  }
}