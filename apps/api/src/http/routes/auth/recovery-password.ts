import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { env } from '@/env';

async function recoveryPassword(app: FastifyInstance) { 
  app.withTypeProvider<ZodTypeProvider>().post(
    '/recovery-password',  
    {
      schema: {
        tags: ['Auth'],
        summary: 'Recovery user password.',
        body: z.object({
          email: z.email(),
        }),
        response: {
          201: z.null(),
        }
      },
    },
    async (request, reply)=> {
      const { email } = request.body;

      const registeredUser = await prisma.user.findUnique({
        where: {
          email,
        }
      });

      if(!registeredUser) {
        // Defer account guessing by recovery endpoint.
        return reply.status(201).send(null);
      }

      const { id: token } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: registeredUser.id,
        },
      });
      
      if(env.NODE_ENV === 'dev') {
        console.info(token);
      }

      return reply.status(201).send(null);
    }
  )
}

export { recoveryPassword };