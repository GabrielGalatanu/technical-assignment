import { Model, DataTypes, Sequelize, Optional } from "sequelize";

type MessageAttributes = {
  id?: number;
  conversation_id: number;
  sender_id: number;
  content: string;
};

type MessageCreationAttributes = Optional<MessageAttributes, "id">;

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id: number;
  public conversation_id!: number;
  public sender_id!: number;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initMessage = (sequelize: Sequelize) => {
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      conversation_id: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      sender_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      content: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "messages",
      sequelize,
    }
  );
};

export { Message, initMessage };
