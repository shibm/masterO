import mysql from "mysql2/promise";
import config from "./index.js";

export const pool = mysql.createPool({
  host: config.host,
  port: config.dbPort,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const verifyDatabaseConnection = async () => {
  const connection = await pool.getConnection();
  connection.release();
};
