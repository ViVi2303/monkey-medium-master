import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "./Profile.js";
import Follow_Profile from "./Follow_Profile.js";
import Mute from "./Mute.js";
import Reading_History from "./Reading_History.js";
import Reading_List from "./Reading_List.js";

const Block = sequelize.define(
  "Block",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    blockedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },

    blockerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },
  },
  {
    tableName: "blocks",
    timestamps: true,
    hooks: {
      afterCreate: async (Block, options) => {
        const me = options.me;
        const user = options.user;

        const operations = [
          Mute.destroy({
            where: { mutedId: user.profileInfo.id, muterId: me.profileInfo.id },
          }),
          Mute.destroy({
            where: { mutedId: me.profileInfo.id, muterId: user.profileInfo.id },
          }),
          Reading_List.destroy({ where: { profileId: me.profileInfo.id } }),
          Reading_History.destroy({ where: { profileId: me.profileInfo.id } }),
        ];

        const [followed, follower] = await Promise.all([
          Follow_Profile.findOne({
            where: {
              followedId: user.profileInfo.id,
              followerId: me.profileInfo.id,
            },
          }),
          Follow_Profile.findOne({
            where: {
              followerId: user.profileInfo.id,
              followedId: me.profileInfo.id,
            },
          }),
        ]);

        if (followed) {
          operations.push(
            Follow_Profile.destroy({
              where: {
                followedId: user.profileInfo.id,
                followerId: me.profileInfo.id,
              },
            }),
            me.profileInfo.increment({ followingCount: -1 }),
            user.profileInfo.increment({ followersCount: -1 })
          );
        }

        if (follower) {
          operations.push(
            Follow_Profile.destroy({
              where: {
                followedId: me.profileInfo.id,
                followerId: user.profileInfo.id,
              },
            }),
            me.profileInfo.increment({ followersCount: -1 }),
            user.profileInfo.increment({ followingCount: -1 })
          );
        }

        await Promise.all(operations);
      },
    },
  }
);

export default Block;
