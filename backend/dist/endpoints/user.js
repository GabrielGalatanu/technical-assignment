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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("../middleware");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const User = models_1.db.user;
const upload = (0, multer_1.default)({ dest: "public/images" });
const authSecretKey = process.env.authSecretKey;
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!user)
            return res.status(404).send({ message: "User Not found." });
        const passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!passwordIsValid)
            return res.status(401).send({
                message: "Invalid Password!",
            });
        let token = jsonwebtoken_1.default.sign({ id: user.id }, authSecretKey, {
            expiresIn: 86400, // 24 hours
        });
        res.status(200).send({
            accessToken: token,
        });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.post("/register", [middleware_1.verifySignUp.checkDuplicateEmail], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            password: bcryptjs_1.default.hashSync(req.body.password, 8),
        });
        yield user.save({});
        return res
            .status(200)
            .send({ message: "User was registered successfully!" });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
router.get("/all", [middleware_1.authJwt.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.userId;
        const usersDB = yield User.findAll({
            attributes: ["id", "firstName", "lastName", "email", "image_url"],
            where: {
                id: {
                    [models_1.db.Op.not]: userID,
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
        if (!users)
            return res.status(404).send({ message: "No users found" });
        res.status(200).send({ users });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
//create a function that updates user
router.put("/update", [middleware_1.authJwt.verifyToken], upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.userId;
        const data = req.body;
        const user = yield User.findOne({
            where: {
                id: userID,
            },
        });
        if (!user)
            return res.status(404).send({ message: "User Not found." });
        const file = req.file;
        const extension = path_1.default.extname(file.originalname);
        const newPath = file.path + extension;
        fs_1.default.rename(file.path, newPath, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Error renaming file:", err);
                return res.sendStatus(500);
            }
            if (user.image_url) {
                const oldImagePath = path_1.default.resolve(`public${user.image_url}`);
                fs_1.default.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    }
                });
            }
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.email = data.email;
            user.image_url = newPath.replace(/\\/g, "/").replace("public", "");
            yield user.save();
            res.status(200).send({ message: "User updated successfully" });
        }));
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map