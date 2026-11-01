import { z } from 'zod';

const inviteSubjectSchema = z.tuple([
	z.union([
		z.literal('manage'), 
		z.literal('get'),
		z.literal('create'),
		z.literal('delete'),
	]),
	z.literal('Invite'),
]);

type InviteSubject = z.infer<typeof inviteSubjectSchema>;

export { inviteSubjectSchema };
export type { InviteSubject };

