import { Sequelize } from "sequelize";
import env from "../../config/env.js";

const sequelize = new Sequelize(
  env.MYSQL_DATABASE,
  env.MYSQL_USERNAME,
  env.MYSQL_PASSWORD,
  {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
