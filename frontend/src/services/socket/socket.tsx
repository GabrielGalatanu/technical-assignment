import socketIOClient from "socket.io-client";
import authService from "../auth/auth";

const ENDPOINT = `${process.env.REACT_APP_CHAT_API_URL}`;
const socketService = socketIOClient(ENDPOINT, {
  query: {
    token: authService.getCurrentUserToken(),
  },
});

const clearSocket = () => {
  socketService.disconnect();
};

export { socketService, clearSocket };
