import { createSubjects } from '@openauthjs/openauth';
import { object, string, optional } from 'valibot';

export const subjects = createSubjects({
  user: object({
    userId: string(),
    email: string(),
    schoolId: optional(string()),
    role: optional(string())
  }),
});

export type Subjects = typeof subjects;