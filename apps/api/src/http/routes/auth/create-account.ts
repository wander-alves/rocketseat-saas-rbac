import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';

async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/accounts',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string().min(8)
        }),
      },
    },
    async (_, reply) => {
      return reply.send({
        message: 'User created!'
      })
    }
  )
 }

 export { createAccount };