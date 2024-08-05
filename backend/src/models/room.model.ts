import { Model, DataTypes, Sequelize, Optional } from "sequelize";

type RoomAttributes = {
  id?: number;
  name: string;
  owner_id: number;
  image_url: string;
};

type RoomCreationAttributes = Optional<RoomAttributes, "id">;

class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes
{
  public id: number;
  public name!: string;
  public owner_id!: number;
  public image_url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initRoom = (sequelize: Sequelize) => {
  Room.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      owner_id: {
        type: DataTypes.INTEGER,
      },
      image_url: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "rooms",
      sequelize,
    }
  );
};

export { Room, initRoom };
