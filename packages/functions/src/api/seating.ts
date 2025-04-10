import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import * as v from 'valibot';
import { SeatingSchemas, SeatingService } from '@core/charts/seating';
import { SeatSchemas, SeatService } from '@core/charts/seat';

const app = new Hono();

export default app;
