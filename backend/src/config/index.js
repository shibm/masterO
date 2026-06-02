import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

const config = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET,
  debugMode: process.env.DEBUG_MODE,
  nodeEnv: process.env.NODE_ENV || "development",
  textlocalKey: process.env.TEXTLOCAL_KEY,
  otpLockTime: process.env.OTP_LOCK_TIME,
  host: process.env.DB_HOST || process.env.MYSQL_HOST || "127.0.0.1",
  dbPort: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
  database: process.env.DB_NAME || process.env.MYSQL_DB,
  user: process.env.DB_USER || process.env.MYSQL_USER,
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || ""
};

export default config;
