import { z } from 'zod';

const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  ownerId: z.string(),
});

type Project = z.infer<typeof projectSchema>;

export { projectSchema };
export type { Project };
