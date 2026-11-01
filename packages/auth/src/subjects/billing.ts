import { z } from 'zod';

const billingSubjectSchema = z.tuple([
	z.union([
		z.literal('manage'), 
		z.literal('get'), 
		z.literal('export')
	]),
	z.literal('Billing'),
]);

type BillingSubject = z.infer<typeof billingSubjectSchema>;

export { billingSubjectSchema };
export type { BillingSubject };

