import { object, string, optional } from 'valibot';
export const subjects = {
  user: object({
    id: string(),
    email: string(),
    role: optional(string()),
  }),
};

export type Subjects = typeof subjects;
