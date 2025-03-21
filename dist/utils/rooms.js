"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("./room");
class Rooms {
    constructor() {
        this.roomsData = new Map();
    }
    new(roomID, password) {
        if (this.roomsData.has(roomID))
            throw new Error('This room already exists');
        const newRoom = new room_1.Room(roomID, password); // Create room with password
        this.roomsData.set(roomID, newRoom);
        return newRoom;
    }
    getRoomsData() {
        return this.roomsData;
    }
    add(roomID, user) {
        var _a;
        if (!this.roomsData.has(roomID))
            throw new Error('This room does not exist');
        return (_a = this.roomsData.get(roomID)) === null || _a === void 0 ? void 0 : _a.addMember(user);
    }
    get(roomID) {
        return this.roomsData.get(roomID);
    }
    delete(roomID) {
        if (!this.roomsData.has(roomID))
            throw new Error('This room does not exist');
        return this.roomsData.delete(roomID);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Rooms();
        }
        return this.instance;
    }
}
exports.default = Rooms;
