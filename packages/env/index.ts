import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  server: {
    NODE_ENV: z.enum(['prod', 'dev']).default('dev'),
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.url().startsWith('postgres://'),
    JWT_SECRET: z.string(),
    PASSWD_ROUNDS: z.coerce.number().default(8),
    GITHUB_OAUTH_URL: z.url(),
    GITHUB_OAUTH_CLIENT_ID: z.string(),
    GITHUB_OAUTH_CLIENT_SECRET: z.string(),
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.url(),
    GITHUB_USERS_URL: z.url(),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SERVER_PORT: process.env.SERVER_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PASSWD_ROUNDS: process.env.PASSWD_ROUNDS,
    GITHUB_OAUTH_URL: process.env.GITHUB_OAUTH_URL,
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
    GITHUB_USERS_URL: process.env.GITHUB_USERS_URL, 
  },
  emptyStringAsUndefined: true,
});

export { env };