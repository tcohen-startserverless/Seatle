import { QueryResponse } from 'electrodb';
import { Furniture } from './entity';

export type FurnitureQueryResponse = QueryResponse<typeof Furniture>;