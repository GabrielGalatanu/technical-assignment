import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Lobby from "../pages/Lobby";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ChatRoom from "../pages/ChatRoom";

import AuthService from "../services/auth/auth";
import NavBar from "../components/layouts/NavBar";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Lobby />} />
          </Route>
        </Route>

        <Route path="/ChatRoom" element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<ChatRoom />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoute = () => {
  const auth = AuthService.isAuthenticated();

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default AppRouter;
