import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { VerifyTokenRequestWithUserId } from "../utils/types";

const authSecretKey = process.env.authSecretKey;

const verifyToken = (
  req: VerifyTokenRequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(403).send({ message: "No token provided!" });
    }

    let token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, authSecretKey, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }

      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const authJwt = {
  verifyToken,
};
