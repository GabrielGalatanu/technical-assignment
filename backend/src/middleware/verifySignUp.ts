import { Response, NextFunction } from "express";
import { db } from "../models";

import { CheckDuplicateEmailRequestWithBody } from "../utils/types";

const User = db.user;

const checkDuplicateEmail = async (
  req: CheckDuplicateEmailRequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.email)
      return res.status(400).send({ message: "Email is required!" });

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      res.status(400).send({
        message: "Email is already in use!",
      });
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const verifySignUp = {
  checkDuplicateEmail,
};
