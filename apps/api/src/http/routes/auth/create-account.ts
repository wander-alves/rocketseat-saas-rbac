import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from "../errors/unauthorized-error";

async function createAccount(app: FastifyInstance) {
  const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8),
  });

  app.withTypeProvider<ZodTypeProvider>().post(
    '/accounts',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new account',
        body: createAccountBodySchema,
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const alreadyRegisteredUser = await prisma.user.findUnique({
        where: {
          email,
        }
      });

      if(alreadyRegisteredUser) { 
        throw new UnauthorizedError('This e-mail is already registered.')
      }

      const domain = email.split('@')[1];

      const autoJoiningOrganization = await prisma.organization.findUnique({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        }
      });

      const passwordHash = await hash(password, 8);

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          member_on: {
            create: autoJoiningOrganization ? {
              organizationId: autoJoiningOrganization.id,
            } : undefined,
          },
        },
      });

      return reply.status(201).send();
    }
  )
 }

 export { createAccount };