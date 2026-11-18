import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider, 
} from "fastify-type-provider-zod";

import { routes } from './routes';
import { errorHandler } from './error-handler';
import { env } from '../env/index';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);

app.setErrorHandler(errorHandler);

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

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(routes);

app.listen({
  port: env.PORT,
}).then(()=> { 
  console.info(`[SERVER] application running on http://localhost:${env.PORT}`);
  console.info(`[DOCS] Swagger docs available on http://localhost:${env.PORT}/docs`);
});