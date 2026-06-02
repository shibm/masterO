import { asyncHandler } from "../utils/asyncHandler.js";
import { listTasksForUser, listUsers } from "../services/userService.js";

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  res.json(users);
});

export const getUserTasks = asyncHandler(async (req, res) => {
  const result = await listTasksForUser(Number(req.params.id), req.query, req.user);
  res.json(result);
});
