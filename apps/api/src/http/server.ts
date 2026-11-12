import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
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
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SaaS RBAC',
      description: 'Fullstack SaaS app with multi-tenant & RBAC',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.register(routes);

app.listen({
  port: env.PORT,
}).then(()=> { 
  console.info(`[SERVER] application running on ${env.PORT}`);
  console.info(`[DOCS] Swagger docs available on http://localhost:${env.PORT}/docs`);
});