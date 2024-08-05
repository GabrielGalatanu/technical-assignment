import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import multer from "multer";

import { verifySignUp, authJwt } from "../middleware";

import { db } from "../models";

import {
  LoginRequestBody,
  RegisterRequestBody,
  GetAllUsersResponse,
} from "../utils/types";

const router = Router();

const User = db.user;

const upload = multer({ dest: "public/images" });

const authSecretKey = process.env.authSecretKey;

router.post(
  "/login",
  async (req: Request<{}, any, LoginRequestBody>, res: Response) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) return res.status(404).send({ message: "User Not found." });

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid)
        return res.status(401).send({
          message: "Invalid Password!",
        });

      let token = jwt.sign({ id: user.id }, authSecretKey, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        accessToken: token,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/register",
  [verifySignUp.checkDuplicateEmail],
  async (req: Request<{}, any, RegisterRequestBody>, res: Response) => {
    try {
      if (!req.body.email || !req.body.password)
        return res.status(400).send({ message: "Missing email or password" });

      if (!req.body.firstName || !req.body.lastName)
        return res
          .status(400)
          .send({ message: "Missing first name or last name" });

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });

      await user.save({});

      return res
        .status(200)
        .send({ message: "User was registered successfully!" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/all",
  [authJwt.verifyToken],
  async (req: any, res: Response<GetAllUsersResponse>) => {
    try {
      const userID = req.userId;

      const usersDB = await User.findAll({
        attributes: ["id", "firstName", "lastName", "email", "image_url"],
        where: {
          id: {
            [db.Op.not]: userID,
          },
        },
      });

      const users = usersDB.map((user) => {
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image_url: user.image_url,
        };
      });

      if (!users) return res.status(404).send({ message: "No users found" });

      res.status(200).send({ users });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

//create a function that updates user

router.put(
  "/update",
  [authJwt.verifyToken],
  upload.single("image"),
  async (req: any, res: Response) => {
    try {
      const userID = req.userId;

      const data = req.body;

      const user = await User.findOne({
        where: {
          id: userID,
        },
      });

      if (!user) return res.status(404).send({ message: "User Not found." });

      const file = req.file;

      const extension = path.extname(file.originalname);
      const newPath = file.path + extension;

      fs.rename(file.path, newPath, async (err: any) => {
        if (err) {
          console.error("Error renaming file:", err);
          return res.sendStatus(500);
        }

        if (user.image_url) {
          const oldImagePath = path.resolve(`public${user.image_url}`);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }

        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.image_url = newPath.replace(/\\/g, "/").replace("public", "");

        await user.save();

        res.status(200).send({ message: "User updated successfully" });
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

export default router;
