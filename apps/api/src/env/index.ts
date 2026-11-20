import "dotenv/config";
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['prod', 'dev', 'test']),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith("postgres://"),
  JWT_SECRET: z.string(),
  PASSWD_ROUNDS: z.coerce.number().default(8),
});

const env = envSchema.parse(process.env);

export { env };