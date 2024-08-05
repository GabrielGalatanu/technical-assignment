"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const socket_io_1 = require("../utils/socket-io");
const middleware_1 = require("../middleware");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const Room = models_1.db.room;
const RoomUser = models_1.db.roomUser;
const RoomMessage = models_1.db.roomMessage;
const upload = (0, multer_1.default)({ dest: "public/images" });
router.post("/create", [middleware_1.authJwt.verifyToken], upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdByUserId = Number(req.userId);
        if (!req.file) {
            return res.status(400).send({ message: "Image file is required" });
        }
        const file = req.file;
        const extension = path_1.default.extname(file.originalname);
        const newPath = file.path + extension;
        fs_1.default.rename(file.path, newPath, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Error renaming file:", err);
                return res.sendStatus(500);
            }
            const newRoom = yield Room.create({
                name: req.body.name,
                image_url: newPath.replace(/\\/g, "/").replace("public", ""),
                owner_id: createdByUserId,
            });
            yield RoomUser.create({
                user_id: createdByUserId,
                room_id: newRoom.id,
            });
            res
                .status(200)
                .send({ message: "Room created successfully", room: newRoom });
        }));
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));
router.get("/rooms", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.userId);
        const rooms = yield Room.findAll({
            attributes: ["id", "name", "owner_id", "image_url"],
        });
        res.status(200).send({ rooms });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.post("/send-message", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.userId);
        let data = req.body;
        const roomUser = yield RoomUser.findOne({
            where: { user_id: userId },
        });
        if (!roomUser) {
            return res.status(400).send({ message: "User not in a room" });
        }
        const message = yield RoomMessage.create({
            content: data.content,
            sender_id: userId,
            room_id: data.room_id,
        });
        (0, socket_io_1.getIO)().to(data.room_id).emit("receiveRoomMessage", message);
        res.status(200).send({ message: "Message sent successfully" });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.get("/messages/:roomId", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.userId);
        const roomId = req.params.roomId;
        const roomUser = yield RoomUser.findOne({
            where: { user_id: userId },
        });
        if (!roomUser) {
            return res.status(400).send({ message: "User not in a room" });
        }
        const messages = yield RoomMessage.findAll({
            where: { room_id: roomId },
        });
        res.status(200).send({ messages });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.get("/check/:roomId", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.userId);
        const roomId = req.params.roomId;
        const roomUser = yield RoomUser.findOne({
            where: { user_id: userId, room_id: roomId },
        });
        if (!roomUser) {
            return res.status(200).send({ isInRoom: false });
        }
        res.status(200).send({ isInRoom: true });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.post("/join", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.userId);
        const roomId = req.body.roomId;
        const roomUser = yield RoomUser.findOne({
            where: { user_id: userId, room_id: roomId },
        });
        if (!roomUser) {
            yield RoomUser.create({
                user_id: userId,
                room_id: roomId,
            });
        }
        const messages = yield RoomMessage.findAll({
            where: { room_id: roomId },
        });
        res.status(200).send({ messages: messages });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.delete("/delete", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
exports.default = router;
//# sourceMappingURL=room.js.map