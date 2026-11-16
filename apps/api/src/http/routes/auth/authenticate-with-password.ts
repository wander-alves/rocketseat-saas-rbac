import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { compare } from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

async function authenticateWithPassword(app: FastifyInstance) {
  const authenticateWithPasswordBodySchema = z.object({
    email: z.email(),
    password: z.string(),
  });

  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/auth', 
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate a user with e-mail and password.',
        body: authenticateWithPasswordBodySchema,
      },
    }, 
    async(request, reply)=> {
      const { email, password } = request.body;

      const registeredUser = await prisma.user.findUnique({
        where: {
          email,
        }
      });

      if(!registeredUser) {
        return reply.status(401).send({
          message: 'Invalid email or password.'
        });
      }

      if(registeredUser.passwordHash === null) {
        return reply.status(400).send({
          message: 'Your account have social login enabled. Please, try it to signin.'
        });
      }

      const passwordMatch = await compare(password, registeredUser.passwordHash);

      if(!passwordMatch) {
        return reply.status(401).send({
          message: 'Invalid email or password.'
        });
      }

      const sessionToken = await reply.jwtSign(
        {
          sub: registeredUser.id,
        },
        {
          sign: {
            expiresIn: '7d'
          },
        },
      );

      return reply.status(201).send({
        sessionToken,
      });
    },
  );
}

export { authenticateWithPassword };