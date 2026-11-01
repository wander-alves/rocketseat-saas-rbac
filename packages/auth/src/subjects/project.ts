import { z } from 'zod';

const projectSubjectSchema = z.tuple([
	z.union([
		z.literal('manage'), 
		z.literal('get'),
		z.literal('create'),
		z.literal('update'),
		z.literal('delete'),
	]),
	z.literal('Project'),
]);

type ProjectSubject = z.infer<typeof projectSubjectSchema>;

export { projectSubjectSchema };
export type { ProjectSubject };

