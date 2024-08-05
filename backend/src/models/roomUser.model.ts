import {Model, DataTypes, Sequelize, Optional} from "sequelize";

type RoomUserAttributes = {
  id?: number;
  user_id: number;
  room_id: number;
};

type RoomUserCreationAttributes = Optional<RoomUserAttributes, "id">;

class RoomUser
  extends Model<RoomUserAttributes, RoomUserCreationAttributes>
  implements RoomUserAttributes
{
  public id: number;
  public user_id!: number;
  public room_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initRoomUser = (sequelize: Sequelize) => {
  RoomUser.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      room_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "roomUsers",
      sequelize,
    }
  );
};

export { RoomUser, initRoomUser };