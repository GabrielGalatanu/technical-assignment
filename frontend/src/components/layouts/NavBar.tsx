import { FC, MouseEvent } from "react";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

import socketIOClient from "socket.io-client";
import authService from "../../services/auth/auth";
import { clearSocket } from "../../services/socket/socket";
import { socketService } from "../../services/socket/socket";

import "../../styles/layouts/NavBar.scss";

const NavBar: FC = () => {
  const navigate = useNavigate();

  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const user = authService.getCurrentUser();
    socketService.emit("logout", user.id);

    clearSocket();

    authService.logout();
    navigate("/login");
  };

  return (
    <div className="nav-bar_container">
      <div className="left">{/* <p>Left</p> */}</div>
      <div className="center">{/* <p>Center</p> */}</div>
      <div className="right">
        <Button className="logout-button" onClick={logout}>
          <p>Logout</p>
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
