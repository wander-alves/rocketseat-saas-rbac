import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { env } from '@/env';
import { UnauthorizedError } from '@/http/routes/errors/unauthorized-error';

async function resetPassword(app: FastifyInstance) { 
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/reset-password',  
    {
      schema: {
        tags: ['Auth'],
        summary: 'Reset user password.',
        body: z.object({
          token: z.string(),
          password: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply)=> {
      const { token, password } = request.body;

      const passwordResetToken = await prisma.token.findUnique({
        where: {
          id: token,
        },
      });

      if(!passwordResetToken) {
        throw new UnauthorizedError();
      }

      const passwordHash = await hash(password, env.PASSWD_ROUNDS);

      await prisma.user.update({
        where: {
          id: passwordResetToken.userId,
        },
        data: {
          passwordHash,
        },
      });

      return reply.status(204).send(null);
    }
  )
}

export { resetPassword };