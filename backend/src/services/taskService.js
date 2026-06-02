import { ApiError } from "../utils/ApiError.js";
import { findUserById } from "../models/userModel.js";
import { createActivityLog } from "../models/activityLogModel.js";
import { createTask, findTaskById, getTasks, updateTask } from "../models/taskModel.js";

const validStatuses = ["pending", "in_progress", "completed"];

export const addTask = async (payload, actor) => {
  const { title, description, assignedTo, dueDate } = payload;

  if (!title || !description || !assignedTo || !dueDate) {
    throw new ApiError(400, "Title, description, assignedTo, and dueDate are required.");
  }

  const assignee = await findUserById(assignedTo);
  if (!assignee || assignee.role !== "employee") {
    throw new ApiError(400, "Task must be assigned to an existing employee.");
  }

  const task = await createTask({
    title,
    description,
    assignedTo,
    dueDate,
    status: "pending"
  });

  await createActivityLog({
    userId: actor.id,
    action: "task_created",
    details: `Task #${task.id} assigned to user #${assignedTo}`
  });

  return task;
};

export const listTasks = async (query, actor) =>
  getTasks({
    status: query.status || "",
    dueDate: query.dueDate || "",
    userId: actor.role === "employee" ? actor.id : "",
    limit: Number(query.limit || 10),
    offset: (Number(query.page || 1) - 1) * Number(query.limit || 10)
  });

export const getTaskDetails = async (id, actor) => {
  const task = await findTaskById(id);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (actor.role === "employee" && Number(task.assigned_to) !== Number(actor.id)) {
    throw new ApiError(403, "You can only access your own tasks.");
  }

  return task;
};

export const editTask = async (id, payload, actor) => {
  const existingTask = await findTaskById(id);

  if (!existingTask) {
    throw new ApiError(404, "Task not found.");
  }

  if (actor.role === "employee" && Number(existingTask.assigned_to) !== Number(actor.id)) {
    throw new ApiError(403, "You can only update your own tasks.");
  }

  if (payload.status && !validStatuses.includes(payload.status)) {
    throw new ApiError(400, "Status must be pending, in_progress, or completed.");
  }

  if (actor.role === "employee") {
    if (payload.title !== undefined || payload.description !== undefined) {
      throw new ApiError(403, "Employees can only update task status.");
    }

    const transitions = {
      pending: "in_progress",
      in_progress: "completed",
      completed: "completed"
    };

    if (payload.status && payload.status !== transitions[existingTask.status]) {
      throw new ApiError(400, "Invalid status transition for employee.");
    }
  }

  const task = await updateTask({
    id,
    title: payload.title,
    description: payload.description,
    status: payload.status
  });

  await createActivityLog({
    userId: actor.id,
    action: "task_updated",
    details: `Task #${task.id} updated by ${actor.role}`
  });

  return task;
};
