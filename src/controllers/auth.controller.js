const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const SALT_ROUNDS = 10;

// Helper: token yaratish
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
  return { accessToken, refreshToken };
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Email mavjudligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        message: "Bu email allaqachon ro'yxatdan o'tgan",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ fullName, email, passwordHash });

    const tokens = generateTokens(user._id);

    // Refresh tokenni saqlash
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(201).json({
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      tokens,
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Email yoki parol noto'g'ri",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        message: "Email yoki parol noto'g'ri",
      });
    }

    const tokens = generateTokens(user._id);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    } catch {
      return res.status(401).json({
        statusCode: 401,
        message: "Token muddati tugagan",
      });
    }

    const user = await User.findOne({ _id: decoded.userId, refreshToken });
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Token yaroqsiz",
      });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({ tokens });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
    return res.status(200).json({ message: "Tizimdan chiqdingiz" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout };
