import { Router } from "express";
import { createUser, getUserTasks, getUsers } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), getUsers);
router.post("/", authenticate, authorize("admin"), createUser);
router.get("/:id/tasks", authenticate, getUserTasks);

export default router;
