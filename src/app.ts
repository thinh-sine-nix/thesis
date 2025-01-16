import FastifyStatic from '@fastify/static';
import FastifyView from '@fastify/view';
import ws from '@fastify/websocket';
import * as dotenv from 'dotenv';
import ejs from 'ejs';
import { fastify } from 'fastify';
import path from 'path';
import routes from './routes';
import startCron from './utils/cron';
import handleWS from './utils/handleWebsocket';

dotenv.config();

const server = fastify({ logger: true });
const PORT = process.env.PORT ? +Number.parseInt(process.env.PORT) : 3002;

(async () => {
    try {
        startCron();

        await server.register(FastifyStatic, {
            root: path.resolve('./public'),
        });

        server.register(FastifyView, {
            engine: {
                ejs,
            },
            root: 'public',
        });

        server.register(routes);

        server.register(ws);
        server.register(async function (fastify) {
            fastify.get('/ws', { websocket: true }, handleWS(server.log));
        });

        server.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`::: -> Server listening at http://localhost:${PORT}`);
        });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
