import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { BadRequestError } from '@/http/routes/errors/bad-request-error';
import { prisma } from '@/lib/prisma';
import { env } from '@/env';

async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with GitHub',
        body: z.object({
          code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { code } = request.body;

      const githubAuthURL = new URL(env.GITHUB_AUTH_URL);
      githubAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID,);
      githubAuthURL.searchParams.set(
        'client_secret',
        env.GITHUB_OAUTH_CLIENT_SECRET,
      );
      githubAuthURL.searchParams.set(
        'redirect_uri',
        env.GITHUB_OAUTH_REDIRECT_URL,
      )
      githubAuthURL.searchParams.set('code', code);

      const githubAccessTokenResponse = await fetch(githubAuthURL, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
        },
      });

      const authTokenResponseData = await githubAccessTokenResponse.json();

      const { access_token: githubAccessToken } = z.object({
        access_token: z.string(),
        token_type: z.literal('bearer'),
        scope: z.string(),
      }).parse(authTokenResponseData);

      const githubUserResponse = await fetch(env.GITHUB_USERS_URL, {
        headers: {
          "Authorization": `Bearer ${githubAccessToken}`,
        },
      });

      const githubUserData = await githubUserResponse.json();
      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z.object({
        id: z.int().transform(String),
        avatar_url: z.url(),
        name: z.string().nullable(),
        email: z.string().nullable(),
      }).parse(githubUserData);

      if(email === null) {
        throw new BadRequestError('Your GitHub account must have an email to authenticate.');
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        }
      });

      if(!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl
          },
        });

        let account = await prisma.account.findUnique({
          where: {
            provider_userId: {
              provider: 'GITHUB',
              userId: user.id,
            }
          }
        });

        if(!account) {
          account = await prisma.account.create({
            data: {
              provider: 'GITHUB',
              providerAccountId: githubId,
              userId: user.id,
            },
          });

          const token = await reply.jwtSign(
            {
              sub: user.id,
            },
            {
              sign: {
                expiresIn: '7d',
              },
            },
          );

          return reply.status(201).send({
            token,
          });
        }
      }
    }
  )
}

export { authenticateWithGithub };