import { Sequelize, Dialect, Op } from "sequelize";
import { User, initUser } from "./user.model";
import { Room, initRoom } from "./room.model";
import { RoomUser, initRoomUser } from "./roomUser.model";
import { RoomMessage, initRoomMessage } from "./roomMessage.model";
import { Conversation, initConversation } from "./conversation.model";
import { Message, initMessage } from "./message.model";

const dbConfig = {
  HOST: process.env.dbHost,
  USER: process.env.dbUser,
  PASSWORD: process.env.dbPassword,
  DB: process.env.dbDatabase,
  dialect: process.env.dbDialect,
  pool: {
    max: parseInt(process.env.dbPoolMax as string),
    min: parseInt(process.env.dbPoolMin as string),
    acquire: parseInt(process.env.dbPoolAcquire as string),
    idle: parseInt(process.env.dbPoolIdle as string),
  },
};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as Dialect,
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
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

initUser(sequelize);
initRoom(sequelize);
initRoomUser(sequelize);
initRoomMessage(sequelize);
initConversation(sequelize);
initMessage(sequelize);

const db = {
  Sequelize,
  sequelize,
  Op,
  user: User,
  room: Room,
  roomUser: RoomUser,
  roomMessage: RoomMessage,
  conversation: Conversation,
  message: Message,
};

export { db };
