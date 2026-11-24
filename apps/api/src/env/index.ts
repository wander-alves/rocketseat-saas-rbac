import "dotenv/config";
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['prod', 'dev', 'test']),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith("postgres://"),
  JWT_SECRET: z.string(),
  PASSWD_ROUNDS: z.coerce.number().default(8),
  GITHUB_AUTH_URL: z.url(),
  GITHUB_USERS_URL: z.url(),
  GITHUB_OAUTH_CLIENT_ID: z.string(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string(),
  GITHUB_OAUTH_REDIRECT_URL: z.url(),
});

const env = envSchema.parse(process.env);

export { env };