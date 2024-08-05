"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authSecretKey = process.env.authSecretKey;
const verifyToken = (req, res, next) => {
    try {
        if (!req.headers["authorization"]) {
            return res.status(403).send({ message: "No token provided!" });
        }
        let token = req.headers["authorization"].split(" ")[1];
        jsonwebtoken_1.default.verify(token, authSecretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }
            req.userId = decoded.id;
            next();
        });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
exports.authJwt = {
    verifyToken,
};
//# sourceMappingURL=verifyToken.js.map