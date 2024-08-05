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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketStore = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("./utils/socket-io");
const user_1 = __importDefault(require("./endpoints/user"));
const room_1 = __importDefault(require("./endpoints/room"));
const message_1 = __importDefault(require("./endpoints/message"));
const app = (0, express_1.default)();
const port = 3002;
app.use(express_1.default.json());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb" }));
app.use(express_1.default.static(path_1.default.resolve("./public")));
//disable cors
app.use((0, cors_1.default)());
app.use("/user", user_1.default);
app.use("/room", room_1.default);
app.use("/message", message_1.default);
app.get("/", (req, res) => {
    res.sendStatus(200);
});
const socket_io_utils_1 = require("./utils/socket-io-utils");
exports.socketStore = {}; // Replace this with Map()?
const onlineUsers = new Map();
const lastPingTime = new Map();
const server = http_1.default.createServer(app);
const io = (0, socket_io_1.initIO)(server);
const PING_INTERVAL = 5000;
const PING_TIMEOUT = 10000;
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    (0, socket_io_utils_1.addToSocketStore)(socket, exports.socketStore);
    const currentId = yield (0, socket_io_utils_1.returnUserIdIfTokenValid)(socket);
    if (currentId === false) {
        socket.disconnect();
        return;
    }
    if (typeof currentId === "number") {
        onlineUsers.set(currentId, socket.id);
        lastPingTime.set(currentId, Date.now());
        io.emit("userStatus", { currentId, status: "online" });
        const keysArray = Array.from(onlineUsers.keys());
        io.emit("userStatusAll", { onlineUsers: keysArray });
    }
    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
    });
    socket.on("sendMessage", ({ conversationId, message }) => {
        io.to(conversationId).emit("receiveMessage", message);
    });
    socket.on("login", (userId) => {
        onlineUsers.set(userId, socket.id);
        lastPingTime.set(userId, Date.now());
        io.emit("userStatus", { userId, status: "online" });
        const keysArray = Array.from(onlineUsers.keys());
        io.emit("userStatusAll", { onlineUsers: keysArray });
    });
    socket.on("logout", (userId) => {
        onlineUsers.delete(userId);
        lastPingTime.delete(userId);
        io.emit("userStatus", { userId, status: "offline" });
    });
    socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                lastPingTime.delete(userId);
                io.emit("userStatus", { userId, status: "offline" });
                break;
            }
        }
        (0, socket_io_utils_1.removeFromSocketStore)(socket, exports.socketStore);
    });
    socket.on("ping", () => {
        var _a;
        const userId = (_a = [...onlineUsers.entries()].find(([, socketId]) => socketId === socket.id)) === null || _a === void 0 ? void 0 : _a[0];
        if (userId) {
            lastPingTime.set(userId, Date.now());
            socket.emit("pong");
            socket.emit("userStatus", { userId, status: "online" });
        }
    });
}));
setInterval(() => {
    const now = Date.now();
    for (let [userId, lastPing] of lastPingTime.entries()) {
        if (now - lastPing > PING_TIMEOUT) {
            onlineUsers.delete(userId);
            lastPingTime.delete(userId);
            io.emit("userStatus", { userId, status: "offline" });
        }
    }
}, PING_INTERVAL);
server.listen(port, () => {
    console.log(`Chat is listening on ${port}`);
});
//# sourceMappingURL=indexbackup.js.map