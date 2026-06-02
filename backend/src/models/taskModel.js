import { pool } from "../config/db.js";

export const createTask = async ({ title, description, assignedTo, status, dueDate }) => {
  const [result] = await pool.execute(
    `INSERT INTO tasks (title, description, assigned_to, status, due_date)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, assignedTo, status, dueDate]
  );

  return findTaskById(result.insertId);
};

export const findTaskById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       t.id,
       t.title,
       t.description,
       t.assigned_to,
       t.status,
       t.due_date,
       t.created_at,
       u.name AS assigned_to_name,
       u.email AS assigned_to_email
     FROM tasks t
     INNER JOIN users u ON u.id = t.assigned_to
     WHERE t.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

export const getTasks = async ({ status, dueDate, userId, limit, offset }) => {
  const filters = [];
  const values = [];

  if (status) {
    filters.push("t.status = ?");
    values.push(status);
  }

  if (dueDate) {
    filters.push("DATE(t.due_date) = ?");
    values.push(dueDate);
  }

  if (userId) {
    filters.push("t.assigned_to = ?");
    values.push(userId);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.execute(
    `SELECT
       t.id,
       t.title,
       t.description,
       t.assigned_to,
       t.status,
       t.due_date,
       t.created_at,
       u.name AS assigned_to_name,
       u.email AS assigned_to_email
     FROM tasks t
     INNER JOIN users u ON u.id = t.assigned_to
     ${whereClause}
     ORDER BY t.due_date ASC, t.id DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM tasks t
     ${whereClause}`,
    values
  );

  return {
    tasks: rows,
    total: countRows[0].total
  };
};

export const updateTask = async ({ id, title, description, status }) => {
  const updates = [];
  const values = [];

  if (title !== undefined) {
    updates.push("title = ?");
    values.push(title);
  }

  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }

  if (status !== undefined) {
    updates.push("status = ?");
    values.push(status);
  }

  if (!updates.length) {
    return findTaskById(id);
  }

  values.push(id);

  await pool.execute(
    `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
    values
  );

  return findTaskById(id);
};
