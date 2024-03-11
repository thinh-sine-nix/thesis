"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WsClients {
    constructor() {
        this.data = new Map();
    }
    add(id, client) {
        return this.data.set(id, client);
    }
    get(id) {
        return this.data.get(id);
    }
    delete(id) {
        if (!this.data.has(id))
            throw new Error('This user is not exists');
        this.data.delete(id);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new WsClients();
        }
        return this.instance;
    }
}
exports.default = WsClients;
//# sourceMappingURL=wsClients.js.map