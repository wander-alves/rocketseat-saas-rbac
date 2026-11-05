import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider, 
} from "fastify-type-provider-zod";

import { routes } from './routes';
import { env } from '../env/index';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);
app.register(routes);



app.listen({
  port: env.PORT,
}).then(()=> { 
  console.info(`[SERVER] application running on ${env.PORT}`);
});