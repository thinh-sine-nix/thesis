"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("./room");
class Rooms {
    constructor() {
        this.roomsData = new Map();
    }
    new(roomID) {
        if (this.roomsData.has(roomID))
            throw new Error('This room is exists');
        const newRoom = new room_1.Room(roomID);
        this.roomsData.set(roomID, newRoom);
        return newRoom;
    }
    getRoomsData() {
        return this.roomsData;
    }
    add(roomID, user) {
        if (!this.roomsData.has(roomID))
            throw new Error('This room is not exists');
        return this.roomsData.get(roomID)?.addMember(user);
    }
    get(roomID) {
        return this.roomsData.get(roomID);
    }
    delete(roomID) {
        if (!this.roomsData.has(roomID))
            throw new Error('This room is not exists');
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
//# sourceMappingURL=rooms.js.map