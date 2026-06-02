import { Router } from "express";
import { createTask, getTask, getTasks, updateTask } from "../controllers/taskController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);
router.post("/", authorize("admin"), createTask);
router.get("/", getTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);

export default router;
