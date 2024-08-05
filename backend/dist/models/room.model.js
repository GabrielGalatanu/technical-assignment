"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoom = exports.Room = void 0;
const sequelize_1 = require("sequelize");
class Room extends sequelize_1.Model {
}
exports.Room = Room;
const initRoom = (sequelize) => {
    Room.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
        },
        owner_id: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        image_url: {
            type: sequelize_1.DataTypes.STRING,
        },
    }, {
        tableName: "rooms",
        sequelize,
    });
};
exports.initRoom = initRoom;
//# sourceMappingURL=room.model.js.map