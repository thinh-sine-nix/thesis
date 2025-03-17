"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = roomRoutes;
const rooms_1 = __importDefault(require("../utils/rooms"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
function roomRoutes(fastify, opts, done) {
    fastify.register(cookie_1.default, {
        secret: "your-secret-key", // (Tùy chọn) Mã hóa cookie
        parseOptions: {} // Các tùy chọn khác
    });
    fastify.post('/:id', async (req, reply) => {
        const { password } = req.body;
        if (!password)
            return reply.status(400).send({ message: "Password is required" });
        try {
            const room = rooms_1.default.getInstance().new(req.params.id, password);
            // Lưu mật khẩu vào cookie
            reply.setCookie(`room_${req.params.id}_password`, password, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 ngày
            });
            reply.send({ secretKey: room.getSecretKey() });
        }
        catch (error) {
            reply.status(400).send({ message: error });
        }
    });
    fastify.get('/:id', (req, reply) => {
        const secretKey = req.query.k;
        const thisRoom = rooms_1.default.getInstance().get(req.params.id);
        if (!thisRoom || thisRoom.getSecretKey() !== secretKey) {
            return reply.redirect('/');
        }
        // Lấy mật khẩu từ cookie
        const savedPassword = req.cookies[`room_${req.params.id}_password`];
        if (savedPassword && thisRoom.checkPassword(savedPassword)) {
            return reply.view('call', { roomId: req.params.id });
        }
        return reply.view('enter-password', { roomId: req.params.id, secretKey });
    });
    fastify.post('/:id/join', async (req, reply) => {
        const { password } = req.body;
        const thisRoom = rooms_1.default.getInstance().get(req.params.id);
        if (!thisRoom)
            return reply.status(404).send({ message: "Room not found" });
        if (!thisRoom.checkPassword(password)) {
            return reply.status(403).send({ message: "Incorrect password" });
        }
        // Lưu mật khẩu vào cookie để lần sau không cần nhập lại
        reply.setCookie(`room_${req.params.id}_password`, password, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 ngày
        });
        reply.send({ success: true });
    });
    done();
}
