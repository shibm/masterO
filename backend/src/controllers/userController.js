import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUser } from "../services/authService.js";
import { listTasksForUser, listUsers } from "../services/userService.js";

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ message: "User registered successfully.", user });
});

export const getUserTasks = asyncHandler(async (req, res) => {
  const result = await listTasksForUser(Number(req.params.id), req.query, req.user);
  res.json(result);
});
