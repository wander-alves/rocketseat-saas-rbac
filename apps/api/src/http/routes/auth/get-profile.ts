  import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { UnauthorizedError } from '../errors/unauthorized-error';

async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get authenticated user profile.',
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
      const { sub } = await request.jwtVerify<{ sub: string }>()
      const userInfo = await prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
        where: {
          id: sub
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