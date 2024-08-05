import React, { useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

import { Room } from "../../utils/types/roomTypes";

import "../../styles/rooms/AvatarRoomComponent.scss";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
    },
  },
}));

interface AvatarProps {
  room: Room;
  onRoomSelect?: (room: Room) => void;
  hasHoverEffect?: boolean;
}

const AvatarComponent = (props: AvatarProps) => {
  const room = props.room;
  const onRoomSelect = props.onRoomSelect;
  const hasHoverEffect = props.hasHoverEffect;
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  const getNameInitials = (Name: string) => {
    return Name[0] + Name[1];
  };

  return (
    <div
      className={`avatar_room_background ${
        hasHoverEffect ? "avatar_room_background_hover_effect" : ""
      }`}
      onClick={() => {
        if (onRoomSelect && hasHoverEffect) {
          onRoomSelect(room);
        }
      }}
    >
      <div className="avatar_container">
        <div className="avatar_image">
          {!room.image_url && (
            <Avatar sx={{ bgcolor: deepPurple[500] }}>
              {getNameInitials(room.name)}
            </Avatar>
          )}

          {room.image_url && (
            <Avatar
              alt={room.name}
              src={`${process.env.REACT_APP_CHAT_API_URL}/${room.image_url}`}
            />
          )}
        </div>

        <div className="avatar_name">{room.name}</div>
      </div>
    </div>
  );
};

export default AvatarComponent;
