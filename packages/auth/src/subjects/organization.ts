import { z } from 'zod';
import { organizationSchema } from '../models/organization';

const organizationSubjectSchema = z.tuple([
  z.union([
    z.literal('manage'), 
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.union([z.literal('Organization'), organizationSchema]),
]);

type OrganizationSubject = z.infer<typeof organizationSubjectSchema>;

export { organizationSubjectSchema };
export type { OrganizationSubject };

