import { FastifyInstance } from 'fastify';
import { UnauthorizedError } from '../routes/errors/unauthorized-error';
import { fastifyPlugin } from 'fastify-plugin';

async function authPlugin(app: FastifyInstance) {
  app.addHook('preHandler', async (request)=> {
    request.getCurrentUserId = async ()=> {
      try{
        const { sub } = await request.jwtVerify<{ sub: string }>();
        
        return sub;
      }catch {
        throw new UnauthorizedError('Invalid session token.');
      }
    }
  });
}

const auth = fastifyPlugin(authPlugin);

export { auth }