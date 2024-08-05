require("dotenv").config();

import express from "express";
import http from "http";
import cors from "cors";
import path from "path";

import { initIO } from "./utils/socket-io";
import userRouter from "./endpoints/user";
import roomRouter from "./endpoints/room";
import messageRouter from "./endpoints/message";

const app = express();
const port = 3002;

app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(express.static(path.resolve("./public")));

//disable cors
app.use(cors());

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/message", messageRouter);

app.get("/", (req: any, res: any) => {
  res.sendStatus(200);
});

//Socket IO:
import { SocketStore } from "./utils/types";
import {
  addToSocketStore,
  removeFromSocketStore,
  returnUserIdIfTokenValid,
} from "./utils/socket-io-utils";

export const socketStore: SocketStore = {}; // Replace this with Map()?
const onlineUsers = new Map<number, string>();
const lastPingTime = new Map<number, number>();

const server = http.createServer(app);
const io = initIO(server);

const PING_INTERVAL = 5000;
const PING_TIMEOUT = 10000;

io.on("connection", async (socket) => {
  addToSocketStore(socket, socketStore);

  const currentId = await returnUserIdIfTokenValid(socket);

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

    removeFromSocketStore(socket, socketStore);
  });

  socket.on("ping", () => {
    const userId = [...onlineUsers.entries()].find(
      ([, socketId]) => socketId === socket.id
    )?.[0];

    if (userId) {
      lastPingTime.set(userId, Date.now());
      socket.emit("pong");
      socket.emit("userStatus", { userId, status: "online" });
    }
  });
});

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
