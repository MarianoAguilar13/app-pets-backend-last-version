import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.POSTGRE_USERNAME,
  password: process.env.POSTGRE_PASSWORD,
  database: process.env.POSTGRE_DATABASE,
  host: process.env.POSTGRE_HOST,
  port: 5432,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: false,
  },
});

//para la bd que sea online, acordarse de cambiarlo
/*
export const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.POSTGRE_USERNAME,
  password: process.env.POSTGRE_PASSWORD,
  database: process.env.POSTGRE_DATABASE,
  host: process.env.POSTGRE_HOST,
  ssl: true,
  port: 5432,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});*/

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
