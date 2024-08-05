import { Model, DataTypes, Sequelize, Optional } from "sequelize";

type ConversationAttributes = {
  id?: number;
  user1_id: number;
  user2_id: number;
};

type ConversationCreationAttributes = Optional<ConversationAttributes, "id">;

class Conversation
  extends Model<ConversationAttributes, ConversationCreationAttributes>
  implements ConversationAttributes
{
  public id: number;
  public user1_id!: number;
  public user2_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initConversation = (sequelize: Sequelize) => {
  Conversation.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user1_id: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      user2_id: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    },
    {
      tableName: "conversations",
      sequelize,
    }
  );
};

export { Conversation, initConversation };