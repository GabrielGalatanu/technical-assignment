import { Model, DataTypes, Sequelize, Optional } from "sequelize";

type RoomMessageAttributes = {
  id?: number;
  content: string;
  sender_id: number;
  room_id: number;
};

type RoomMessageCreationAttributes = Optional<RoomMessageAttributes, "id">;

class RoomMessage
  extends Model<RoomMessageAttributes, RoomMessageCreationAttributes>
  implements RoomMessageAttributes
{
  public id: number;
  public content!: string;
  public sender_id!: number;
  public room_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initRoomMessage = (sequelize: Sequelize) => {
  RoomMessage.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.STRING,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      room_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "roomMessages",
      sequelize,
    }
  );
};

export { RoomMessage, initRoomMessage };
