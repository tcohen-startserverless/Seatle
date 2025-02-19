import { object, string } from 'valibot';
import { createSubjects } from '@openauthjs/openauth';

export const subjects = createSubjects({
  user: object({
    workspaceId: string(),
    userId: string(),
    email: string(),
  }),
});
