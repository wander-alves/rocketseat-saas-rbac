import type { FastifyInstance } from 'fastify';

import { createAccount } from '@/http/routes/auth/create-account';
import { authenticateWithPassword } from '@/http/routes/auth/authenticate-with-password';
import { getProfile } from '@/http/routes/auth/get-profile';
import { recoveryPassword } from '@/http/routes/auth/recovery-password';
import { resetPassword } from '@/http/routes/auth/reset-password';

function routes(app: FastifyInstance) {
  app.register(createAccount);
  app.register(authenticateWithPassword);
  app.register(getProfile);
  app.register(recoveryPassword);
  app.register(resetPassword);
}

export { routes }