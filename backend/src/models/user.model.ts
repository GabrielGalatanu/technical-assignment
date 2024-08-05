import { Model, DataTypes, Sequelize, Optional } from "sequelize";

type UserAttributes = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image_url: string;
};

type UserCreationAttributes = Optional<UserAttributes, "id">;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public image_url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      image_url: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "users",
      sequelize,
    }
  );
};

export { User, initUser };
