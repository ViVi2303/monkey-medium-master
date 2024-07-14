import cron from "node-cron";
import User from "./models/mysql/User.js";
import { Op } from "sequelize";

cron
  .schedule("0 0 * * *", async () => {
    try {
      const currentDate = new Date();

      const usersToUnband = await User.findAll({
        where: { bannedUntil: { [Op.lt]: currentDate } },
      });

      for (const user of usersToUnband) {
        await user.update({
          status: "normal",
          banType: null,
          bannedById: null,
          bannedUntil: null,
        });
      }
      console.log("Cron task successfully");
    } catch (error) {
      console.log("Error in cron job =>", error);
    }
  })
  .start();
