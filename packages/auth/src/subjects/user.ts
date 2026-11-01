import { z } from 'zod';

const userSubjectSchema = z.tuple([
  z.union([
    z.literal('manage'), 
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('User'),
]);

type UserSubject = z.infer<typeof userSubjectSchema>;

export { userSubjectSchema };
export type { UserSubject };

