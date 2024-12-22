"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = startCron;
const node_cron_1 = __importDefault(require("node-cron"));
const rooms_1 = __importDefault(require("./rooms"));
function startCron() {
    node_cron_1.default.schedule('*/5 * * * *', () => {
        rooms_1.default.getInstance()
            .getRoomsData()
            .forEach((room, key) => {
            const isEmptyMember = room.getMember().length === 0;
            const hasNotBeenUpdatedSinceFiveMinutesAgo = new Date().getTime() - room.getUpdatedAt().getTime() >= 5 * 60 * 1000;
            if (hasNotBeenUpdatedSinceFiveMinutesAgo && isEmptyMember)
                rooms_1.default.getInstance().delete(key);
        });
    });
}
