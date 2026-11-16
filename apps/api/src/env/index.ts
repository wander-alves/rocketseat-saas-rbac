import "dotenv/config";
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith("postgres://"),
  JWT_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export { env };