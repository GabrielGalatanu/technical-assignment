import { Router, Request, Response } from "express";

import fs from "fs";
import path from "path";
import multer from "multer";

import { getIO } from "../utils/socket-io";
import { authJwt } from "../middleware";
import { db } from "../models";

import {
  CreateRoomRequestBody,
  CustomSecureRequest,
  JoinRoomRequestBody,
} from "../utils/types";

const router = Router();

const Room = db.room;
const RoomUser = db.roomUser;
const RoomMessage = db.roomMessage;

const upload = multer({ dest: "public/images" });

router.post(
  "/create",
  [authJwt.verifyToken],
  upload.single("image"),
  async (req: CustomSecureRequest<CreateRoomRequestBody>, res: Response) => {
    try {
      const createdByUserId = Number(req.userId);

      if (!req.file) {
        return res.status(400).send({ message: "Image file is required" });
      }

      const file = req.file;
      const extension = path.extname(file.originalname);
      const newPath = file.path + extension;

      fs.rename(file.path, newPath, async (err: any) => {
        if (err) {
          console.error("Error renaming file:", err);
          return res.sendStatus(500);
        }

        const newRoom = await Room.create({
          name: req.body.name,
          image_url: newPath.replace(/\\/g, "/").replace("public", ""),
          owner_id: createdByUserId,
        });

        await RoomUser.create({
          user_id: createdByUserId,
          room_id: newRoom.id,
        });

        res
          .status(200)
          .send({ message: "Room created successfully", room: newRoom });
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/rooms",
  [authJwt.verifyToken],
  async (req: CustomSecureRequest<CreateRoomRequestBody>, res: Response) => {
    try {
      const userId = Number(req.userId);

      const rooms = await Room.findAll({
        attributes: ["id", "name", "owner_id", "image_url"],
      });

      res.status(200).send({ rooms });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/send-message",
  [authJwt.verifyToken],
  async (req: any, res: Response) => {
    try {
      const userId = Number(req.userId);

      let data = req.body;

      const roomUser = await RoomUser.findOne({
        where: { user_id: userId },
      });

      if (!roomUser) {
        return res.status(400).send({ message: "User not in a room" });
      }

      const message = await RoomMessage.create({
        content: data.content,
        sender_id: userId,
        room_id: data.room_id,
      });

      getIO().to(data.room_id).emit("receiveRoomMessage", message);

      res.status(200).send({ message: "Message sent successfully" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/messages/:roomId",
  [authJwt.verifyToken],
  async (req: any, res: Response) => {
    try {
      const userId = Number(req.userId);
      const roomId = req.params.roomId;

      const roomUser = await RoomUser.findOne({
        where: { user_id: userId },
      });

      if (!roomUser) {
        return res.status(400).send({ message: "User not in a room" });
      }

      const messages = await RoomMessage.findAll({
        where: { room_id: roomId },
      });

      res.status(200).send({ messages });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/check/:roomId",
  [authJwt.verifyToken],
  async (req: any, res: Response) => {
    try {
      const userId = Number(req.userId);
      const roomId = req.params.roomId;

      const roomUser = await RoomUser.findOne({
        where: { user_id: userId, room_id: roomId },
      });

      if (!roomUser) {
        return res.status(200).send({ isInRoom: false });
      }

      res.status(200).send({ isInRoom: true });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.post("/join", [authJwt.verifyToken], async (req: any, res: Response) => {
  try {
    const userId = Number(req.userId);
    const roomId = req.body.roomId;

    const roomUser = await RoomUser.findOne({
      where: { user_id: userId, room_id: roomId },
    });

    if (!roomUser) {
      await RoomUser.create({
        user_id: userId,
        room_id: roomId,
      });
    }

    const messages = await RoomMessage.findAll({
      where: { room_id: roomId },
    });

    res.status(200).send({ messages: messages });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete(
  "/delete",
  [authJwt.verifyToken],
  async (req: CustomSecureRequest<CreateRoomRequestBody>, res: Response) => {
    try {
      // const userId = Number(req.userId);
      // const room = await Room.findOne({
      //   where: { user_id: userId },
      // });
      // if (!room) return res.status(400).send({ message: "Room not found" });
      // await Room.destroy({
      //   where: { user_id: userId },
      // });
      // res.status(200).send({ message: "Room deleted successfully" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

export default router;
