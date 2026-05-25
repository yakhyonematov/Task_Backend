const { Router } = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
} = require("../validations/task.validation");

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", validate(createTaskSchema), createTask);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", validate(updateStatusSchema), updateTaskStatus);

module.exports = router;
