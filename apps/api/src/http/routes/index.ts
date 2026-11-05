import type { FastifyInstance } from 'fastify';
import { createAccount } from './auth/create-account';

function routes(app: FastifyInstance) {
  app.register(createAccount);
}

export { routes }