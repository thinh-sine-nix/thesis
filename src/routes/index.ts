import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import roomRoutes from './room.router';

export default async (
    fastify: FastifyInstance | any,
    opts: FastifyPluginOptions | any,
    done: (err?: Error | undefined) => void
) => {
    fastify.get('/', async function (req: any, reply: any) {
        await reply.view('home');
    });
    await fastify.register(roomRoutes, { prefix: '/room' });
    done();
};
