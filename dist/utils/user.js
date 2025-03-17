"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setScreenShare(_arg0) {
        throw new Error('Method not implemented.');
    }
    constructor(peerId, name, socket) {
        this.name = name;
        this.peerId = peerId;
        this.openCamera = true;
        this.openMicrophone = true;
        this.socket = socket;
    }
    setCamera(openCamera) {
        this.openCamera = openCamera;
    }
    setMicrophone(openMicrophone) {
        this.openMicrophone = openMicrophone;
    }
}
exports.User = User;
