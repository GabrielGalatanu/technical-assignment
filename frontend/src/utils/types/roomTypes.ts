export type Room = {
  id?: number;
  name: string;
  image?: any;
  image_url?: string;
};

export type CreateRoomResponseData = {
  message?: string;
};

export type CreateRoomResult =
  | { success: true }
  | { success: false; message: string };

export type GetRoomsResponseData =
  | {
      rooms: Room[];
    }
  | { message: string };

export type GetRoomsResult =
  | {
      success: boolean;
      rooms: Room[];
    }
  | {
      success: false;
      message: string;
    };

export type JoinRoomResult = {
  success: boolean;
  message?: string;
};

export type JoinRoomResponseData = {
  message?: string;
};

export type DeleteRoomResponseData = {
  message?: string;
};

export type DeleteRoomResult =
  | { success: true }
  | { success: false; message: string };
