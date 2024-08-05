import jwt_decode from "jwt-decode";

import {
  LoginResponseData,
  LoginResult,
  RegistrationResponseData,
  RegistrationResult,
  GetAllUsersResponseData,
  GetAllUsersResult,
} from "../../utils/types/userTypes";

import { socketService } from "../socket/socket";

const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await fetch("http://localhost:3002/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data: LoginResponseData = await response.json();

    if (response.status === 200 && data.accessToken) {
      const user: any = await jwt_decode(data.accessToken);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.accessToken);

      socketService.emit("login", user.id);

      return { success: true };
    }

    return { success: false, message: data.message || "Login failed" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error" };
  }
};

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<RegistrationResult> => {
  try {
    const response = await fetch("http://localhost:3002/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    let data: RegistrationResponseData = await response.json();

    if (response.status === 200) {
      return { success: true };
    }

    return { success: false, message: data.message || "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Network error" };
  }
};

const getAllUsers = async (): Promise<GetAllUsersResult> => {
  try {
    const userToken = localStorage.getItem("token");

    const response = await fetch("http://localhost:3002/user/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    let data: GetAllUsersResponseData = await response.json();

    if (response.status === 200)
      if ("users" in data) return { success: true, users: data.users };

    if ("message" in data)
      return {
        success: false,
        message: data.message || "Get all users failed",
      };

    return { success: false, message: "Get all users failed" };
  } catch (error) {
    console.error("Get all users error:", error);
    return { success: false, message: "Network error" };
  }
};

const updateUser = async (data: any) => {
  try {
    const userToken = localStorage.getItem("token");

    const response = await fetch("http://localhost:3002/user/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: data,
    });

    let res = await response.json();

    if (response.status === 200) {
      return { success: true };
    }

    return { success: false, message: res.message || "Update failed" };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, message: "Network error" };
  }
};

export { login, register, getAllUsers, updateUser };
