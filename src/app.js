require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ statusCode: 404, message: "Route topilmadi" });
});

// Global error handler (eng oxirda bo'lishi shart)
app.use(errorHandler);

// MongoDB ga ulanish va serverni ishga tushirish
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("XATOLIK: MONGO_URI .env faylda ko'rsatilmagan!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB ga ulandi");
    app.listen(PORT, () => {
      console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB ulanish xatosi:", err.message);
    process.exit(1);
  });
