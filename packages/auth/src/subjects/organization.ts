import { z } from 'zod';

const organizationSubjectSchema = z.tuple([
  z.union([
    z.literal('manage'), 
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.literal('Organization'),
]);

type OrganizationSubject = z.infer<typeof organizationSubjectSchema>;

export { organizationSubjectSchema };
export type { OrganizationSubject };

