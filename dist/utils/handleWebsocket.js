"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleWS;
const wsMessage_1 = __importDefault(require("./wsMessage"));
const rooms_1 = __importDefault(require("./rooms"));
const user_1 = require("./user");
const wsClients_1 = __importDefault(require("./wsClients"));
function handleWS(log) {
    return function (connection, request) {
        var _a;
        const { peerId, roomId, name } = request.query;
        //add to client cache & room
        const newUser = new user_1.User(peerId, name, connection.socket);
        wsClients_1.default.getInstance().add(peerId, newUser);
        const beforeUpdateRoomData = [
            ...(((_a = rooms_1.default.getInstance().get(roomId)) === null || _a === void 0 ? void 0 : _a.getMemberWithoutSocket()) || []),
        ];
        rooms_1.default.getInstance().add(roomId, newUser);
        connection.socket.send(JSON.stringify(new wsMessage_1.default('join_room', beforeUpdateRoomData)));
        connection.socket.on('message', (messageRaw) => {
            var _a, _b, _c, _d, _e;
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const { type, message } = JSON.parse(messageRaw.toString());
            switch (type) {
                case 'microphone':
                    (_a = wsClients_1.default.getInstance().get(peerId)) === null || _a === void 0 ? void 0 : _a.setMicrophone(Boolean(message));
                    (_b = rooms_1.default.getInstance()
                        .get(roomId)) === null || _b === void 0 ? void 0 : _b.boardcast(new wsMessage_1.default('microphone', { peerId, value: message }));
                    break;
                case 'camera':
                    (_c = wsClients_1.default.getInstance().get(peerId)) === null || _c === void 0 ? void 0 : _c.setCamera(Boolean(message));
                    (_d = rooms_1.default.getInstance()
                        .get(roomId)) === null || _d === void 0 ? void 0 : _d.boardcast(new wsMessage_1.default('camera', { peerId, value: message }));
                    break;
                case 'message':
                    log.info({ type: 'message', msg: JSON.stringify({ roomId, peerId, message }) });
                    (_e = rooms_1.default.getInstance()
                        .get(roomId)) === null || _e === void 0 ? void 0 : _e.boardcast(new wsMessage_1.default('message', { peerId, value: message }));
                    break;
                default: return;
            }
        });
        connection.socket.on('close', () => {
            var _a, _b;
            //remove client cache & delete from room
            try {
                (_a = rooms_1.default.getInstance().get(roomId)) === null || _a === void 0 ? void 0 : _a.removeMember(peerId);
                wsClients_1.default.getInstance().delete(peerId);
                (_b = rooms_1.default.getInstance().get(roomId)) === null || _b === void 0 ? void 0 : _b.boardcast(new wsMessage_1.default('disconnect', peerId));
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
