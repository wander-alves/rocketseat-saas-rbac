import type { FastifyInstance } from 'fastify';
import { createAccount } from './auth/create-account';
import { authenticateWithPassword } from './auth/authenticate-with-password';

function routes(app: FastifyInstance) {
  app.register(createAccount);
  app.register(authenticateWithPassword);
}

export { routes }