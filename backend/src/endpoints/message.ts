import { Router, Response } from "express";

import { authJwt } from "../middleware";
import sequelize from "sequelize";

import { db } from "../models";
import { getIO } from "../utils/socket-io";

const router = Router();

const Message = db.message;

router.post("/send", [authJwt.verifyToken], async (req: any, res: Response) => {
  try {
    const userId = Number(req.userId);
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      res.status(400).send({ message: "Missing conversationId or content" });
      return;
    }

    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: userId,
      content: content,
    });

    getIO().to(conversationId).emit("receiveMessage", message);

    res.status(200).send({ message: "Message sent" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get(
  "/:conversationId",
  [authJwt.verifyToken],
  async (req: any, res: Response) => {
    try {
      //TO DO: VALIDATIONS NEEDED

      const userId = Number(req.userId);
      const conversationId = req.params.conversationId;

      const messages = await Message.findAll({
        where: { conversation_id: conversationId },
        order: [["createdAt", "ASC"]],
      });

      res.status(200).send({ messages });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/conversation/:userId",
  [authJwt.verifyToken],
  async (req: any, res: Response) => {
    try {
      const myUserId = Number(req.userId);
      const otherUserId = req.params.userId;

      const conversation = await db.conversation.findOne({
        where: {
          [sequelize.Op.or]: [
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

      const newConversation = await db.conversation.create({
        user1_id: myUserId,
        user2_id: otherUserId,
      });

      res
        .status(200)
        .send({ success: true, conversationId: newConversation.id });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

export default router;
