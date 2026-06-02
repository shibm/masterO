import { ApiError } from "../utils/ApiError.js";
import { findUserById, getAllUsers } from "../models/userModel.js";
import { getTasks } from "../models/taskModel.js";

export const listUsers = async () => getAllUsers();

export const listTasksForUser = async (userId, query, actor) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (actor.role === "employee" && Number(actor.id) !== Number(userId)) {
    throw new ApiError(403, "You can only access your own tasks.");
  }

  return getTasks({
    userId,
    status: query.status || "",
    dueDate: query.dueDate || "",
    limit: Number(query.limit || 10),
    offset: (Number(query.page || 1) - 1) * Number(query.limit || 10)
  });
};
