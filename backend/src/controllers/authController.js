import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser, registerUser } from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ message: "User registered successfully.", user });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});
