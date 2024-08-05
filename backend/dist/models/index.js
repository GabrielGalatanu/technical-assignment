"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = require("./user.model");
const room_model_1 = require("./room.model");
const roomUser_model_1 = require("./roomUser.model");
const roomMessage_model_1 = require("./roomMessage.model");
const conversation_model_1 = require("./conversation.model");
const message_model_1 = require("./message.model");
const dbConfig = {
    HOST: process.env.dbHost,
    USER: process.env.dbUser,
    PASSWORD: process.env.dbPassword,
    DB: process.env.dbDatabase,
    dialect: process.env.dbDialect,
    pool: {
        max: parseInt(process.env.dbPoolMax),
        min: parseInt(process.env.dbPoolMin),
        acquire: parseInt(process.env.dbPoolAcquire),
        idle: parseInt(process.env.dbPoolIdle),
    },
};
const sequelize = new sequelize_1.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});
try {
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
}
catch (error) {
    console.error("Unable to connect to the database:", error);
}
(0, user_model_1.initUser)(sequelize);
(0, room_model_1.initRoom)(sequelize);
(0, roomUser_model_1.initRoomUser)(sequelize);
(0, roomMessage_model_1.initRoomMessage)(sequelize);
(0, conversation_model_1.initConversation)(sequelize);
(0, message_model_1.initMessage)(sequelize);
const db = {
    Sequelize: sequelize_1.Sequelize,
    sequelize,
    Op: sequelize_1.Op,
    user: user_model_1.User,
    room: room_model_1.Room,
    roomUser: roomUser_model_1.RoomUser,
    roomMessage: roomMessage_model_1.RoomMessage,
    conversation: conversation_model_1.Conversation,
    message: message_model_1.Message,
};
exports.db = db;
//# sourceMappingURL=index.js.map