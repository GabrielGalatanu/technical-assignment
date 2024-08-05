import { Request } from "express";

export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyTokenRequestWithUserId extends Request {
  userId?: string;
}

export interface CheckDuplicateEmailRequestWithBody extends Request {
  body: { email: string };
}

export interface CreateRoomRequestBody {
  name: string;
  image: string;
}

export interface JoinRoomRequestBody {
  roomId: string;
}

export interface CustomSecureRequest<T = any> extends Request {
  userId?: string;
  body: T;
  file?: any;
}

export interface SocketStore {
  [userId: number]: string;
}

export type GetAllUsersResponse = { users: User[] } | { message: string };
