const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error("XATOLIK: MONGO_URI .env faylda ko'rsatilmagan!");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB ga muvaffaqiyatli ulandi");
  } catch (error) {
    console.error("MongoDB ulanish xatosi:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
