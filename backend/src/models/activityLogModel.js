import { pool } from "../config/db.js";

export const createActivityLog = async ({ userId, action, details }) => {
  await pool.execute(
    "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)",
    [userId, action, details]
  );
};
