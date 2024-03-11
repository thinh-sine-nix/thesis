"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const uuid_1 = require("uuid");
class Room {
    constructor(id) {
        this.member = [];
        this.secretKey = (0, uuid_1.v4)();
        this.id = id;
        this.updatedAt = new Date();
        this.createdAt = new Date();
    }
    getId() {
        return this.id;
    }
    getSecretKey() {
        return this.secretKey;
    }
    getMember() {
        return this.member;
    }
    getMemberWithoutSocket() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return this.member.map(({ socket, ...rest }) => rest);
    }
    addMember(user) {
        this.updatedAt = new Date();
        return this.member.push(user);
    }
    removeMember(id) {
        this.updatedAt = new Date();
        this.member = this.member.filter(({ peerId }) => peerId !== id);
        return this.member;
    }
    boardcast(message) {
        const listClients = this.member;
        listClients?.forEach((client) => client.socket.send(JSON.stringify(message)));
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map