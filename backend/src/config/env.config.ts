import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";

// Load environment variables from .env file
config();

const env = cleanEnv(process.env, {
  APP_URL: str(),
  FRONTEND_URL: str({
    default: "http://localhost:3002"
  }),
  APP_PORT: port({
    default: 8080,
  }),
  DB_USER: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_HOST: str(),
  DB_PORT: port(),
  DB_DIALECT: str(),
  JWT_SECRET: str(),
  GMAIL_APP_PASSWORD: str(),
  GMAIL_USER: str(),
});

export default env;
