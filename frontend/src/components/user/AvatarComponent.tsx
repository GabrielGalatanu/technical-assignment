import React from "react";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

import { User } from "../../utils/types/userTypes";

import "../../styles/user/AvatarComponent.scss";

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
  user: User;
  isOnline: boolean;
  onUserSelect?: (user: User) => void;
  hasHoverEffect?: boolean;
}

const AvatarComponent = (props: AvatarProps) => {
  const user = props.user;
  const isOnline = props.isOnline;
  const onUserSelect = props.onUserSelect;
  const hasHoverEffect = props.hasHoverEffect;

  const getNameInitials = (firstName: string, lastName: string) => {
    return firstName[0] + lastName[0];
  };

  return (
    <div
      className={`avatar_background ${
        hasHoverEffect ? "avatar_background_hover_effect" : ""
      }`}
      onClick={() => {
        if (onUserSelect && hasHoverEffect) {
          onUserSelect(user);
        }
      }}
    >
      <div className="avatar_container">
        <div className="avatar_image">
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: isOnline ? "#44b700" : "#969695",
              },
            }}
          >
            {!user.image_url && (
              <Avatar sx={{ bgcolor: deepPurple[500] }}>
                {getNameInitials(user.firstName, user.lastName)}
              </Avatar>
            )}

            {user.image_url && (
              <Avatar
                alt={user.lastName}
                src={`${process.env.REACT_APP_CHAT_API_URL}/${user.image_url}`}
              />
            )}
          </StyledBadge>
        </div>

        <div className="avatar_name">
          {user.firstName} {user.lastName}
        </div>
      </div>
    </div>
  );
};

export default AvatarComponent;
