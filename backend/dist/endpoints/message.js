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
const middleware_1 = require("../middleware");
const sequelize_1 = __importDefault(require("sequelize"));
const models_1 = require("../models");
const socket_io_1 = require("../utils/socket-io");
const router = (0, express_1.Router)();
const Message = models_1.db.message;
router.post("/send", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.userId);
        const { conversationId, content } = req.body;
        if (!conversationId || !content) {
            res.status(400).send({ message: "Missing conversationId or content" });
            return;
        }
        const message = yield Message.create({
            conversation_id: conversationId,
            sender_id: userId,
            content: content,
        });
        (0, socket_io_1.getIO)().to(conversationId).emit("receiveMessage", message);
        res.status(200).send({ message: "Message sent" });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.get("/:conversationId", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //TO DO: VALIDATIONS NEEDED
        const userId = Number(req.userId);
        const conversationId = req.params.conversationId;
        const messages = yield Message.findAll({
            where: { conversation_id: conversationId },
            order: [["createdAt", "ASC"]],
        });
        res.status(200).send({ messages });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.get("/conversation/:userId", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myUserId = Number(req.userId);
        const otherUserId = req.params.userId;
        const conversation = yield models_1.db.conversation.findOne({
            where: {
                [sequelize_1.default.Op.or]: [
                    { user1_id: myUserId, user2_id: otherUserId },
                    { user1_id: otherUserId, user2_id: myUserId },
                ],
            },
        });
        if (conversation) {
            res
                .status(200)
                .send({ success: true, conversationId: conversation.id });
            return;
        }
        const newConversation = yield models_1.db.conversation.create({
            user1_id: myUserId,
            user2_id: otherUserId,
        });
        res
            .status(200)
            .send({ success: true, conversationId: newConversation.id });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
exports.default = router;
//# sourceMappingURL=message.js.map