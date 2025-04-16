import { QueryResponse } from 'electrodb';
import { Person } from './entity';

export type PersonQueryResponse = QueryResponse<typeof Person>;