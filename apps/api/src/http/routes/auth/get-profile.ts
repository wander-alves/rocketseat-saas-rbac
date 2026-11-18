  import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

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
          403: z.object({
            message: z.string(),
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
        return reply.status(403).send({
          message: 'Unauthorized access.'
        });
      }

      reply.send({
        user: userInfo,
      });
    }
  )
}

export { getProfile };