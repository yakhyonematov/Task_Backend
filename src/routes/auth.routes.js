const { Router } = require("express");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require("../validations/user.validation");

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refresh);
router.post("/logout", authMiddleware, logout);

module.exports = router;
