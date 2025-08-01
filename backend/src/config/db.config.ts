import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import env from "./env.config";
import * as models from "../models";

// Initialize Sequelize instance with configuration
const createSequelizeInstance = (): Sequelize => {
  return new Sequelize({
    database: env.DB_NAME,
    dialect: env.DB_DIALECT as Dialect,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    models: Object.values(models),
    logging: false, // Disable SQL query logging for cleaner output
  });
};

const sequelize = createSequelizeInstance();

export const connectDb = async (): Promise<void> => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    
    // Synchronize database models
    const syncOptions = {
      alter: false,
      force: false, // Set to false for safe operation
    };
    
    await sequelize.sync(syncOptions);
    console.log("Database tables synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // Re-throw to stop the application
  }
};

export default sequelize;
