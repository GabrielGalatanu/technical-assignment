"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConversation = exports.Conversation = void 0;
const sequelize_1 = require("sequelize");
class Conversation extends sequelize_1.Model {
}
exports.Conversation = Conversation;
const initConversation = (sequelize) => {
    Conversation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user1_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        },
        user2_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        },
    }, {
        tableName: "conversations",
        sequelize,
    });
};
exports.initConversation = initConversation;
//# sourceMappingURL=conversation.model.js.map