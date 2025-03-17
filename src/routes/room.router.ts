import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import Rooms from '../utils/rooms';
import fastifyCookie from '@fastify/cookie';

type MyRequest = FastifyRequest<{
    Params: { id: string };  
    Querystring: {
        k: string;
        password: string;
    };
    Body: { password: string };  
}>;

export default function roomRoutes(
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
) {

    fastify.register(fastifyCookie, {
        secret: "your-secret-key", // (Tùy chọn) Mã hóa cookie
        parseOptions: {} // Các tùy chọn khác
    });
    

    fastify.post('/:id', async (req: FastifyRequest<{ Params: { id: string }; Body: { password: string } }>, reply: FastifyReply) => {
        const { password } = req.body;  
        if (!password) return reply.status(400).send({ message: "Password is required" });
    
        try {
            const room = Rooms.getInstance().new(req.params.id, password);
    
            // Lưu mật khẩu vào cookie
            reply.setCookie(`room_${req.params.id}_password`, password, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 ngày
            });
    
            reply.send({ secretKey: room.getSecretKey() });
        } catch (error) {
            reply.status(400).send({ message: error });
        }
    });
    
    
    
    fastify.get('/:id', (req: MyRequest, reply: FastifyReply) => {
        const secretKey = req.query.k;
        const thisRoom = Rooms.getInstance().get(req.params.id);
    
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
    
    fastify.post('/:id/join', async (req: FastifyRequest<{ Params: { id: string }; Body: { password: string } }>, reply: FastifyReply) => {
        const { password } = req.body;
        const thisRoom = Rooms.getInstance().get(req.params.id);
    
        if (!thisRoom) return reply.status(404).send({ message: "Room not found" });
    
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
