import type { FastifyInstance } from 'fastify';
import { createAccount } from './auth/create-account';
import { authenticateWithPassword } from './auth/authenticate-with-password';
import { getProfile } from './auth/get-profile';

function routes(app: FastifyInstance) {
  app.register(createAccount);
  app.register(authenticateWithPassword);
  app.register(getProfile);
}

export { routes }