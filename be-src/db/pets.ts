import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conection";

export class Pet extends Model {}

Pet.init(
  {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    picURL: DataTypes.STRING,
    localidad: DataTypes.STRING,
    provincia: DataTypes.STRING,
    lost: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "pet" }
);
