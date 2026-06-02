import app from "./app.js";
import config from "./config/index.js";
import { pool } from "./config/db.js";

const port = config.port;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();

    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database.", error.message);
    process.exit(1);
  }
};

startServer();
