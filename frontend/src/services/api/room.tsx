import {
  CreateRoomResponseData,
  CreateRoomResult,
  GetRoomsResult,
  GetRoomsResponseData,
  JoinRoomResult,
  JoinRoomResponseData,
  DeleteRoomResult,
  DeleteRoomResponseData,
  Room,
} from "../../utils/types/roomTypes";

import authService from "../auth/auth";

const createRoom = async (room: Room): Promise<CreateRoomResult> => {
  try {
    const userToken = authService.getCurrentUserToken();

    let formData = new FormData();
    formData.append("name", room.name);
    formData.append("image", room.image);

    const response = await fetch("http://localhost:3002/room/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });

    let data: CreateRoomResponseData = await response.json();

    if (response.status === 200) return { success: true };

    return { success: false, message: data.message || "Create room failed" };
  } catch (error) {
    console.error("Create room error:", error);
    return { success: false, message: "Network error" };
  }
};

const getRooms = async (): Promise<GetRoomsResult> => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch("http://localhost:3002/room/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    let data: GetRoomsResponseData = await response.json();

    if (response.status === 200)
      if ("rooms" in data) return { success: true, rooms: data.rooms };

    if ("message" in data)
      return { success: false, message: data.message || "Get rooms failed" };

    return { success: false, message: "Get rooms failed" };
  } catch (error) {
    console.error("Get rooms error:", error);
    return { success: false, message: "Network error" };
  }
};

const joinRoom = async (roomId: number): Promise<JoinRoomResult> => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch("http://localhost:3002/room/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        roomId: roomId,
      }),
    });

    let data: JoinRoomResponseData = await response.json();

    if (response.status === 200)
      return { success: true, message: data.message };

    return { success: false, message: data.message || "Join room failed" };
  } catch (error) {
    console.error("Join room error:", error);
    return { success: false, message: "Network error" };
  }
};

const deleteRoom = async (): Promise<DeleteRoomResult> => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch(`http://localhost:3002/room/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    let data: DeleteRoomResponseData = await response.json();

    if (response.status === 200) return { success: true };

    return { success: false, message: data.message || "Delete room failed" };
  } catch (error) {
    console.error("Delete room error:", error);
    return { success: false, message: "Network error" };
  }
};

const getRoomMessages = async (roomId: number) => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch(
      `http://localhost:3002/room/messages/${roomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    let data = await response.json();

    if (response.status === 200)
      return { success: true, messages: data.messages };

    return {
      success: false,
      message: data.message || "Get room messages failed",
    };
  } catch (error) {
    console.error("Get room messages error:", error);
    return { success: false, message: "Network error" };
  }
};

const sendRoomMessage = async (roomId: number, content: string) => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch("http://localhost:3002/room/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        room_id: roomId,
        content: content,
      }),
    });

    let data = await response.json();

    if (response.status === 200)
      return { success: true, message: data.message };

    return {
      success: false,
      message: data.message || "Send room message failed",
    };
  } catch (error) {
    console.error("Send room message error:", error);
    return { success: false, message: "Network error" };
  }
};

const checkIfUserIsInRoom = async (roomId: number) => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch(`http://localhost:3002/room/check/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    let data = await response.json();

    if (response.status === 200)
      return { success: true, isInRoom: data.isInRoom };

    return {
      success: false,
      message: data.message || "Check if user is in room failed",
    };
  } catch (error) {
    console.error("Check if user is in room error:", error);
    return { success: false, message: "Network error" };
  }
};

export {
  createRoom,
  getRooms,
  joinRoom,
  deleteRoom,
  getRoomMessages,
  sendRoomMessage,
  checkIfUserIsInRoom,
};
