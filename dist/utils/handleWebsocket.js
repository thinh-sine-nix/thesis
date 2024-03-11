"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wsMessage_1 = __importDefault(require("./wsMessage"));
const rooms_1 = __importDefault(require("./rooms"));
const user_1 = require("./user");
const wsClients_1 = __importDefault(require("./wsClients"));
function handleWS(log) {
    return function (connection, request) {
        const { peerId, roomId, name } = request.query;
        //add to client cache & room
        const newUser = new user_1.User(peerId, name, connection.socket);
        wsClients_1.default.getInstance().add(peerId, newUser);
        const beforeUpdateRoomData = [
            ...(rooms_1.default.getInstance().get(roomId)?.getMemberWithoutSocket() || []),
        ];
        rooms_1.default.getInstance().add(roomId, newUser);
        connection.socket.send(JSON.stringify(new wsMessage_1.default('join_room', beforeUpdateRoomData)));
        connection.socket.on('message', (messageRaw) => {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const { type, message } = JSON.parse(messageRaw.toString());
            switch (type) {
                case 'microphone':
                    wsClients_1.default.getInstance().get(peerId)?.setMicrophone(Boolean(message));
                    rooms_1.default.getInstance()
                        .get(roomId)
                        ?.boardcast(new wsMessage_1.default('microphone', { peerId, value: message }));
                    break;
                case 'camera':
                    wsClients_1.default.getInstance().get(peerId)?.setCamera(Boolean(message));
                    rooms_1.default.getInstance()
                        .get(roomId)
                        ?.boardcast(new wsMessage_1.default('camera', { peerId, value: message }));
                    break;
                case 'message':
                    log.info({ type: 'message', msg: JSON.stringify({ roomId, peerId, message }) });
                    rooms_1.default.getInstance()
                        .get(roomId)
                        ?.boardcast(new wsMessage_1.default('message', { peerId, value: message }));
                    break;
                default: return;
            }
        });
        connection.socket.on('close', () => {
            //remove client cache & delete from room
            try {
                rooms_1.default.getInstance().get(roomId)?.removeMember(peerId);
                wsClients_1.default.getInstance().delete(peerId);
                rooms_1.default.getInstance().get(roomId)?.boardcast(new wsMessage_1.default('disconnect', peerId));
            }
            catch (err) {
                let message = 'Unknown Error';
                if (err instanceof Error)
                    message = err.message;
                log.info({ type: 'out_room', msg: message });
            }
        });
    };
}
exports.default = handleWS;
//# sourceMappingURL=handleWebsocket.js.map