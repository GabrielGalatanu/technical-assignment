import { SocketStore } from "./types";
import { Socket } from "socket.io";

import { decodeJwtToken } from "./token";

const addToSocketStore = async (socket: Socket, socketStore: SocketStore) => {
  try {
    if (socket.handshake.query.token === "null") return;
    if (typeof socket.handshake.query.token !== "string") return;

    const decoded: any = await decodeJwtToken(socket.handshake.query.token);

    if (decoded.id) socketStore[decoded.id] = socket.id;
  } catch (e) {
    console.log(e);
  }
};

const removeFromSocketStore = (socket: Socket, socketStore: SocketStore) => {
  for (const userId in socketStore) {
    if (socketStore[userId] === socket.id) {
      delete socketStore[userId];
      break;
    }
  }
};

const returnUserIdIfTokenValid = async (
  socket: Socket
): Promise<number | boolean> => {
  try {
    if (socket.handshake.query.token === "null") return false;
    if (typeof socket.handshake.query.token !== "string") return false;

    const decoded: any = await decodeJwtToken(socket.handshake.query.token);

    return decoded.id;
  } catch (e) {
    console.log(e);
  }
};

export { addToSocketStore, removeFromSocketStore, returnUserIdIfTokenValid };
