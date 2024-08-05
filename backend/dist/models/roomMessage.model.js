"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoomMessage = exports.RoomMessage = void 0;
const sequelize_1 = require("sequelize");
class RoomMessage extends sequelize_1.Model {
}
exports.RoomMessage = RoomMessage;
const initRoomMessage = (sequelize) => {
    RoomMessage.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: sequelize_1.DataTypes.STRING,
        },
        sender_id: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        room_id: {
            type: sequelize_1.DataTypes.INTEGER,
        },
    }, {
        tableName: "roomMessages",
        sequelize,
    });
};
exports.initRoomMessage = initRoomMessage;
//# sourceMappingURL=roomMessage.model.js.map