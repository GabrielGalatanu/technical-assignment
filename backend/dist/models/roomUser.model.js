"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoomUser = exports.RoomUser = void 0;
const sequelize_1 = require("sequelize");
class RoomUser extends sequelize_1.Model {
}
exports.RoomUser = RoomUser;
const initRoomUser = (sequelize) => {
    RoomUser.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        room_id: {
            type: sequelize_1.DataTypes.INTEGER,
        },
    }, {
        tableName: "roomUsers",
        sequelize,
    });
};
exports.initRoomUser = initRoomUser;
//# sourceMappingURL=roomUser.model.js.map