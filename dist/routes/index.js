"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_router_1 = __importDefault(require("./room.router"));
exports.default = async (fastify, opts, done) => {
    fastify.get('/', async function (req, reply) {
        await reply.view('home');
    });
    await fastify.register(room_router_1.default, { prefix: '/room' });
    done();
};
