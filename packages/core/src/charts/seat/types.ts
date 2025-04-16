import { QueryResponse } from 'electrodb';
import { Seat } from './entity';

export type SeatQueryResponse = QueryResponse<typeof Seat>;