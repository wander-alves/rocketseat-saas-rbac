  import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { UnauthorizedError } from '@/http/routes/errors/unauthorized-error';
import { auth } from '@/http/middlewares/auth';

async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .register(auth)
  .get(
    '/profile',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get authenticated user profile.',
        security: [
          { bearerAuth: [] },
        ],
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string(),
              avatarUrl: z.string().nullable(),
            }),
          }),
        }
      }
    },
    async (request, reply)=> {
      const userId = await request.getCurrentUserId();
      const userInfo = await prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
        where: {
          id: userId
        }
      });

      if(!userInfo) {
        throw new UnauthorizedError();
      }

      reply.send({
        user: userInfo,
      });
    }
  )
}

export { getProfile };