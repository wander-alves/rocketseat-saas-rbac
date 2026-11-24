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

import { routes } from '@/http/routes';
import { errorHandler } from '@/http/error-handler';
import { env } from '@rbac/env';

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
    },
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
  port: env.SERVER_PORT,
}).then(()=> { 
  console.info(`[SERVER] application running on http://localhost:${env.SERVER_PORT}`);
  console.info(`[DOCS] Swagger docs available on http://localhost:${env.SERVER_PORT}/docs`);
});