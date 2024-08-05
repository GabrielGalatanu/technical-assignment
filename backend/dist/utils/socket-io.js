"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initIO = void 0;
const socket_io_1 = require("socket.io");
let io;
const initIO = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Allow all origins, adjust as needed
            methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        },
    });
    return io;
};
exports.initIO = initIO;
const getIO = () => {
    if (!io)
        throw new Error("Must call .initIO(server) before you can call .getIO()");
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket-io.js.map