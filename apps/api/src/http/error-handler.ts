import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';

import { BadRequestError } from './routes/errors/bad-request-error';
import { UnauthorizedError } from './routes/errors/unauthorized-error';

function errorHandler(error: FastifyError, _: FastifyRequest, reply: FastifyReply) {
    if (error.code === "FST_ERR_VALIDATION") {
      return reply.status(400).send({
        message: error.message,
      });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: z.treeifyError(error).errors,
      });
    }

    if (error instanceof BadRequestError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    if (error instanceof UnauthorizedError) {
      return reply.status(401).send({
        message: error.message,
      });
    }

    
    return reply.status(500).send({
      message: 'Internal server error.'
    });
}

export { errorHandler }