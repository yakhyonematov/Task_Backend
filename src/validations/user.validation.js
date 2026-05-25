const { z } = require("zod");

const registerSchema = z.object({
  fullName: z
    .string({ required_error: "To'liq ism kiritilishi shart" })
    .trim()
    .min(3, "Ism kamida 3 ta harfdan iborat bo'lishi kerak")
    .max(50, "Ism juda uzun (maksimal 50 ta harf)"),

  email: z
    .string({ required_error: "Elektron pochta manzili shart" })
    .trim()
    .toLowerCase()
    .email("Noto'g'ri elektron pochta formati (masalan: misol@mail.com)"),

  password: z
    .string({ required_error: "Parol kiritilishi shart" })
    .min(8, "Parol uzunligi kamida 8 ta belgidan iborat bo'lishi shart")
    .max(32, "Parol juda uzun (maksimal 32 ta belgi)")
    // Regex orqali kuchli parol talab qilish:
    .regex(/[A-Z]/, "Parolda kamida bitta katta harf bo'lishi kerak")
    .regex(/[a-z]/, "Parolda kamida bitta kichik harf bo'lishi kerak")
    .regex(/[0-9]/, "Parolda kamida bitta raqam bo'lishi kerak")
    .regex(
      /[@$!%*?&#]/,
      "Parolda kamida bitta maxsus belgi bo'lishi kerak (@, $, !, %, *, ?, &, #)"
    ),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email kiritilishi shart" })
    .trim()
    .toLowerCase()
    .email("Noto'g'ri elektron pochta formati"),
  password: z
    .string({ required_error: "Parol kiritilishi shart" })
    .min(1, "Parol maydoni bo'sh bo'lishi mumkin emas"),
});

const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: "Refresh token majburiy" })
    .min(1, "Refresh token bo'sh bo'lmasin"),
});

module.exports = { registerSchema, loginSchema, refreshTokenSchema };
