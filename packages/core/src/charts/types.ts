import { CollectionResponse, QueryResponse } from 'electrodb';
import { Chart } from './chart';
import { DB } from '@core/dynamo';

export type ChartsResponse = CollectionResponse<typeof DB, 'charts'>;
export type ChartQueryResponse = QueryResponse<typeof Chart>;
