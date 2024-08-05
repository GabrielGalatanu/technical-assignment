"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnUserIdIfTokenValid = exports.removeFromSocketStore = exports.addToSocketStore = void 0;
const token_1 = require("./token");
const addToSocketStore = (socket, socketStore) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (socket.handshake.query.token === "null")
            return;
        if (typeof socket.handshake.query.token !== "string")
            return;
        const decoded = yield (0, token_1.decodeJwtToken)(socket.handshake.query.token);
        if (decoded.id)
            socketStore[decoded.id] = socket.id;
    }
    catch (e) {
        console.log(e);
    }
});
exports.addToSocketStore = addToSocketStore;
const removeFromSocketStore = (socket, socketStore) => {
    for (const userId in socketStore) {
        if (socketStore[userId] === socket.id) {
            delete socketStore[userId];
            break;
        }
    }
};
exports.removeFromSocketStore = removeFromSocketStore;
const returnUserIdIfTokenValid = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (socket.handshake.query.token === "null")
            return false;
        if (typeof socket.handshake.query.token !== "string")
            return false;
        const decoded = yield (0, token_1.decodeJwtToken)(socket.handshake.query.token);
        return decoded.id;
    }
    catch (e) {
        console.log(e);
    }
});
exports.returnUserIdIfTokenValid = returnUserIdIfTokenValid;
//# sourceMappingURL=socket-io-utils.js.map