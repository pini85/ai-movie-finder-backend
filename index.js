import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import dbConnector from './services/dbConnector.js';
import firstRoute from './firstRoute.js';
const fastify = Fastify({
  logger: true,
});

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'string',
    },
  },
};
const options = {
  schema: schema,
  dotenv: true,
  data: process.env,
};

fastify.register(firstRoute);

const initialize = async () => {
  fastify.register(fastifyEnv, options);
  await fastify.after();
  fastify.register(dbConnector);
};

initialize();

(async () => {
  try {
    await fastify.ready();
    await fastify.listen({ port: process.env.PORT });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
