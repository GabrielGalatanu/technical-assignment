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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignUp = void 0;
const models_1 = require("../models");
const User = models_1.db.user;
const checkDuplicateEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email)
            return res.status(400).send({ message: "Email is required!" });
        const user = yield User.findOne({
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
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
exports.verifySignUp = {
    checkDuplicateEmail,
};
//# sourceMappingURL=verifySignUp.js.map