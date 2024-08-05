export type LoginResponseData = {
  accessToken?: string;
  [key: string]: any; // This allows for other properties in the data object
};

export type LoginResult =
  | { success: true }
  | { success: false; message: string };

export type RegistrationResponseData = {
  message?: string;
};

export type RegistrationResult =
  | { success: true }
  | { success: false; message: string };

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  image_url?: string;
};

export type GetAllUsersResponseData = { users: User[] } | { message: string };

export type GetAllUsersResult =
  | { success: true; users: User[] }
  | { success: false; message: string };
