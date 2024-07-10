import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import roomRoutes from './room.router';
import { FastifyReply } from 'fastify/types/reply';

export default async(
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
) => {
    fastify.get('/', async function (req: unknown, reply: FastifyReply) {
        await reply.view('home');
    });
    await fastify.register(roomRoutes, { prefix: '/room' });
    done();
};
