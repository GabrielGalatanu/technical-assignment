"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMessage = exports.Message = void 0;
const sequelize_1 = require("sequelize");
class Message extends sequelize_1.Model {
}
exports.Message = Message;
const initMessage = (sequelize) => {
    Message.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        conversation_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        },
        sender_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        content: {
            type: sequelize_1.DataTypes.STRING,
        },
    }, {
        tableName: "messages",
        sequelize,
    });
};
exports.initMessage = initMessage;
//# sourceMappingURL=message.model.js.map