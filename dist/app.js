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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
(async () => {
    try {
        (0, cron_1.default)();
        //serve static
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
        //websocket
        server.register(websocket_1.default);
        server.register(async function (fastify) {
            fastify.get('/ws', { websocket: true }, (0, handleWebsocket_1.default)(server.log));
        });
        server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log('Server listening at http://localhost:3000');
        });
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
