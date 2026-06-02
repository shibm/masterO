import { Router } from "express";
import { getUserTasks, getUsers } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/:id/tasks", authenticate, getUserTasks);

export default router;
