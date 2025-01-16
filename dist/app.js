"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const static_1 = __importDefault(require("@fastify/static"));
const view_1 = __importDefault(require("@fastify/view"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const dotenv = __importStar(require("dotenv"));
const ejs_1 = __importDefault(require("ejs"));
const fastify_1 = require("fastify");
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const cron_1 = __importDefault(require("./utils/cron"));
const handleWebsocket_1 = __importDefault(require("./utils/handleWebsocket"));
dotenv.config();
const server = (0, fastify_1.fastify)({ logger: true });
const PORT = process.env.PORT ? +Number.parseInt(process.env.PORT) : 3002;
(async () => {
    try {
        (0, cron_1.default)();
        await server.register(static_1.default, {
            root: path_1.default.resolve('./public'),
        });
        server.register(view_1.default, {
            engine: {
                ejs: ejs_1.default,
            },
            root: 'public',
        });
        server.register(routes_1.default);
        server.register(websocket_1.default);
        server.register(async function (fastify) {
            fastify.get('/ws', { websocket: true }, (0, handleWebsocket_1.default)(server.log));
        });
        server.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`::: -> Server listening at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
