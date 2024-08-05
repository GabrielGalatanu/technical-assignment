import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer;

export const initIO = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Allow all origins, adjust as needed
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    },
  });
  return io;
};

export const getIO = () => {
  if (!io)
    throw new Error("Must call .initIO(server) before you can call .getIO()");
  return io;
};
