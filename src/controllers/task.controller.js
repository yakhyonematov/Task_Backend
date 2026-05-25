const Task = require("../models/task.model");

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ data: tasks });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) {
      // Task mavjud lekin boshqa userliki
      const exists = await Task.findById(req.params.id);
      if (exists) {
        return res.status(403).json({
          statusCode: 403,
          message: "Bu vazifaga ruxsatingiz yo'q, boshqaning vazifasi!",
        });
      }
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      userId: req.user.userId,
      title,
      description: description || null,
      priority: priority || "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return res.status(201).json({
      data: task,
      message: "Vazifa muvaffaqiyatli yaratildi",
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        statusCode: 403,
        message: "Bu vazifaga ruxsatingiz yo'q",
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined)
      task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    return res.status(200).json({
      data: task,
      message: "Vazifa muvaffaqiyatli yangilandi",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        statusCode: 403,
        message: "Bu vazifaga ruxsatingiz yo'q",
      });
    }

    await task.deleteOne();

    return res
      .status(200)
      .json({ message: "Vazifa muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        statusCode: 403,
        message: "Bu vazifaga ruxsatingiz yo'q",
      });
    }

    task.status = req.body.status;
    await task.save();

    return res.status(200).json({
      data: { _id: task._id, status: task.status },
      message: "Vazifa holati yangilandi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
