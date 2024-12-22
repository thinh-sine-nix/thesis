"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WSMessage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(type, message) {
        this.type = type;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.message = message;
    }
}
exports.default = WSMessage;
