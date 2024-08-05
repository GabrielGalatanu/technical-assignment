import { useState, useEffect } from "react";
import { socketService } from "../services/socket/socket";

const useUserStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const handleUserStatus = ({
      userId,
      status,
    }: {
      userId: number;
      status: string;
    }) => {
      setOnlineUsers((prevOnlineUsers) => {
        const newOnlineUsers = new Set(prevOnlineUsers);

        if (status === "online") {
          newOnlineUsers.add(userId);
        } else {
          newOnlineUsers.delete(userId);
        }

        return newOnlineUsers;
      });
    };

    const handleUserStatusAll = ({
      onlineUsers,
    }: {
      onlineUsers: number[];
    }) => {
      const onlineUsersSet = new Set(onlineUsers);
      setOnlineUsers(onlineUsersSet);
    };

    socketService.on("userStatus", handleUserStatus);
    socketService.on("userStatusAll", handleUserStatusAll);

    const pingInterval = setInterval(() => {
      socketService.emit("ping");
    }, 15000);

    return () => {
      socketService.off("userStatus", handleUserStatus);
      socketService.off("userStatusAll", handleUserStatusAll);
      clearInterval(pingInterval);
    };
  }, []);

  return onlineUsers;
};

export default useUserStatus;
