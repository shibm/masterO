import { asyncHandler } from "../utils/asyncHandler.js";
import { addTask, editTask, getTaskDetails, listTasks } from "../services/taskService.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await addTask(req.body, req.user);
  res.status(201).json(task);
});

export const getTasks = asyncHandler(async (req, res) => {
  const result = await listTasks(req.query, req.user);
  res.json(result);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskDetails(Number(req.params.id), req.user);
  res.json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await editTask(Number(req.params.id), req.body, req.user);
  res.json(task);
});
