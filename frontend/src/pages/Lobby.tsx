import React, { useState, useEffect, useRef } from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";

import BasicButton from "../components/common/BasicButton";
import ChatTextfield from "../components/common/ChatTextfield";
import AvatarComponent from "../components/user/AvatarComponent";
import AvatarRoomGroup from "../components/rooms/AvatarRoomComponent";
import CreateRoomModal from "../components/modal/CreateRoomModal";
import UpdateUserInfoModal from "../components/modal/UpdateUserInfoModal";

import {
  getRooms,
  joinRoom,
  createRoom,
  sendRoomMessage,
  checkIfUserIsInRoom,
} from "../services/api/room";
import { getAllUsers } from "../services/api/user";
import { sendMessage, fetchConversationId } from "../services/api/messages";
import { socketService } from "../services/socket/socket";
import authService from "../services/auth/auth";

import useUserStatus from "../hooks/useUserStatus";
import useChat from "../hooks/useChat";
import useRoomChat from "../hooks/useRoomChat";

import { Room } from "../utils/types/roomTypes";
import { User } from "../utils/types/userTypes";
import { Message } from "../utils/types/messageTypes";

import "../styles/page/Lobby.scss";

const Lobby = () => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(
    authService.getCurrentUser()
  );
  const onlineUsers: any = useUserStatus();

  const [conversationId, setConversationId] = useState<number>(0);
  const [refreshRoomMessagesTrigger, setRefreshRoomMessagesTrigger] =
    useState<boolean>(false);
  const messages: Message[] = useChat(conversationId);
  const roomMessages: Message[] = useRoomChat(
    selectedRoom?.id,
    refreshRoomMessagesTrigger
  );

  const [askJoinRoom, setAskJoinRoom] = useState<Room | null>(null);
  const [tabValue, setTabValue] = React.useState("1");
  const [input, setInput] = useState("");

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editRoomModalName, setRoomEditModalName] = React.useState("");
  const [editRoomModalImage, setEditRoomModalImage] = React.useState("");

  const [editUserModalOpen, setEditUserModalOpen] = React.useState(false);

  useEffect(() => {
    fetchUsers();
    getRoomsList();

    return () => {
      socketService.off("update-rooms");
    };
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current)
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }, [messages, roomMessages]);

  const handleCreateRoomSubmit = async () => {
    let response = await createRoom({
      name: editRoomModalName,
      image: editRoomModalImage,
    });

    if (response.success) getRoomsList();

    setEditModalOpen(false);
  };

  const fetchUsers = async () => {
    const users = await getAllUsers();

    if (users.success) setUsers(users.users);
  };

  const getRoomsList = async () => {
    const rooms = await getRooms();

    if (rooms.success) setRooms(rooms.rooms);
  };

  const handleChangeTabValue = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTabValue(newValue);
  };

  const onUserSelect = async (user: User) => {
    setAskJoinRoom(null);
    setSelectedUser(user);
    // setSelectedRoom(null);

    if (!user.id) return;

    const conversationIdFetch = await fetchConversationId(user.id);

    if (conversationIdFetch.success) {
      setConversationId(conversationIdFetch.conversationId);
      // setSelectedRoom(null);
    }
  };

  const onRoomSelect = async (room: Room) => {
    setAskJoinRoom(null);
    if (!room.id) return;

    const isUserInRoom = await checkIfUserIsInRoom(room.id);

    if (!isUserInRoom.isInRoom) {
      setAskJoinRoom(room);
      return;
    }

    setSelectedRoom(room);
    // setConversationId(0);
    setSelectedUser(null);
  };

  const joinRoomChat = (room: Room) => async () => {
    if (!room.id) return;

    const result = await joinRoom(room.id);

    if (result.success) {
      setRefreshRoomMessagesTrigger(!refreshRoomMessagesTrigger);
      setSelectedRoom(askJoinRoom);
      setAskJoinRoom(null);
    } else {
      console.error("Failed to join room:", result.message);
    }
  };

  const submitMessage = async () => {
    if (!input) return;

    setInput("");

    if (tabValue === "1") {
      const newMessage: Message = {
        conversationId: conversationId,
        sender_id: currentUser?.id!,
        content: input,
      };

      const result = await sendMessage(newMessage);

      if (result.success) {
        // Play a sound or something;
      } else {
        console.error("Failed to send message:", result.message);
      }
    }

    if (tabValue === "2") {
      if (!selectedRoom?.id) return;

      const result = await sendRoomMessage(selectedRoom.id, input);

      if (result.success) {
        // Play a sound or something;
      } else {
        console.error("Failed to send message:", result.message);
      }
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find((user) => user.id === userId);

    return `${user?.firstName} ${user?.lastName}`;
  };

  return (
    <div className="lobby_container">
      <div className="create_room_button_container">
        <BasicButton
          label="Create Room"
          onPress={() => setEditModalOpen(true)}
        />

        <BasicButton
          label="Edit User"
          onPress={() => setEditUserModalOpen(true)}
        />
      </div>
      <div className="lobby_centered">
        <div className="contacts_container">
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeTabValue}>
                <Tab label="Users" value="1" />
                <Tab label="Groups" value="2" />
              </TabList>
            </Box>
          </TabContext>

          <div className="users_container">
            {tabValue === "1" &&
              users.map((user) => (
                <AvatarComponent
                  key={user.id}
                  user={user}
                  isOnline={onlineUsers.has(user.id)}
                  onUserSelect={() => onUserSelect(user)}
                  hasHoverEffect={true}
                />
              ))}
            {tabValue === "2" &&
              rooms.map((room) => (
                <AvatarRoomGroup
                  key={room.id}
                  room={room}
                  onRoomSelect={() => onRoomSelect(room)}
                  hasHoverEffect={true}
                />
              ))}
          </div>
        </div>

        <div className="chat_container">
          <div className="chat_header">
            {tabValue === "1" && selectedUser && (
              <div className="chat_header_user_info">
                <AvatarComponent
                  key={selectedUser?.id}
                  user={selectedUser!}
                  isOnline={onlineUsers.has(selectedUser?.id)}
                />
              </div>
            )}
          </div>
          <div className="chat_messages" ref={chatMessagesRef}>
            {askJoinRoom && (
              <div className="ask_join_room_button_container">
                <BasicButton
                  label="Join Room"
                  onPress={joinRoomChat(askJoinRoom)}
                />
              </div>
            )}

            {!askJoinRoom &&
              tabValue === "1" &&
              messages.map((message) => (
                <>
                  {message.sender_id === currentUser?.id ? (
                    <>
                      <div className="chat_message chat_message_sent">
                        <p>{message.content}</p>
                      </div>
                    </>
                  ) : (
                    <div className="chat_message chat_message_received">
                      <span>{getUserName(message.sender_id)}</span>
                      <p>{message.content}</p>
                    </div>
                  )}
                </>
              ))}

            {!askJoinRoom &&
              tabValue === "2" &&
              roomMessages.map((message) => (
                <>
                  {message.sender_id === currentUser?.id ? (
                    <div className="chat_message chat_message_sent">
                      <p>{message.content}</p>
                    </div>
                  ) : (
                    <div className="chat_message chat_message_received">
                      <span>{getUserName(message.sender_id)}</span>
                      <p>{message.content}</p>
                    </div>
                  )}
                </>
              ))}
          </div>
          {!askJoinRoom && (conversationId || selectedRoom) && (
            <div className="chat_input_container">
              <Box
                sx={{
                  py: 2,
                  display: "grid",
                  gap: 2,
                  alignItems: "center",
                  width: "90%",
                }}
              >
                <ChatTextfield
                  label="Type in here and press Enter..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onEnterPress={() => {
                    submitMessage();
                  }}
                />
              </Box>
            </div>
          )}
        </div>
      </div>

      <CreateRoomModal
        name={editRoomModalName}
        image={editRoomModalImage}
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        handleSubmit={handleCreateRoomSubmit}
        setName={setRoomEditModalName}
        setImage={setEditRoomModalImage}
      />

      <UpdateUserInfoModal
        user={currentUser!}
        image={currentUser?.image_url}
        open={editUserModalOpen}
        handleClose={() => setEditUserModalOpen(false)}
      />
    </div>
  );
};

export default Lobby;
