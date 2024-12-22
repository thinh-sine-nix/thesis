"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
        return this.member.map((_a) => {
            var { socket } = _a, rest = __rest(_a, ["socket"]);
            return rest;
        });
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
        listClients === null || listClients === void 0 ? void 0 : listClients.forEach((client) => client.socket.send(JSON.stringify(message)));
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.Room = Room;
