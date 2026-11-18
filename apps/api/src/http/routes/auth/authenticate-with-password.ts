import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { compare } from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { BadRequestError } from '../errors/bad-request-error';

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
        response: {
          201: z.object({
            token: z.string(),
          }),
        }
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
        throw new UnauthorizedError('Invalid email or password.');
      }

      if(registeredUser.passwordHash === null) {
        throw new BadRequestError('Your account have social login enabled. Please, try it to signin.');
      }

      const passwordMatch = await compare(password, registeredUser.passwordHash);

      if(!passwordMatch) {
        throw new UnauthorizedError('Invalid email or password.');
      }

      const token = await reply.jwtSign(
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
        token,
      });
    },
  );
}

export { authenticateWithPassword };