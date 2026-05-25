const { z } = require("zod");

const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Vazifa sarlavhasi majburiy" })
    .trim()
    .min(3, "Vazifa sarlavhasi kamida 3 ta belgidan iborat bo'lsin")
    .max(100, "Sarlavha 100 ta belgidan oshmasligi kerak"),

  description: z
    .string()
    .trim()
    .max(500, "Tavsif juda uzun (maksimal 500 ta belgi)")
    .optional()
    .or(z.literal("")),

  status: z
    .enum(["TODO", "IN_PROGRESS", "DONE"], {
      errorMap: () => ({
        message:
          "Status faqat 'TODO', 'IN_PROGRESS' yoki 'DONE' bo'lishi mumkin",
      }),
    })
    .default("TODO"),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"], {
      errorMap: () => ({
        message: "Prioritet faqat 'LOW', 'MEDIUM' yoki 'HIGH' bo'lishi mumkin",
      }),
    })
    .default("MEDIUM"),

  dueDate: z
    .string()
    .datetime({ message: "Noto'g'ri sana formati (string bo'lishi kerak)" })
    .optional()
    .nullable()
    .refine(
      (dateStr) => {
        if (!dateStr) return true;
        return new Date(dateStr) >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      { message: "Bajarilish muddati o'tib ketgan sana bo'lishi mumkin emas" }
    ),
});

const updateTaskSchema = createTaskSchema.partial();

const updateStatusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"], {
    errorMap: () => ({
      message: "Status faqat 'TODO', 'IN_PROGRESS' yoki 'DONE' bo'lishi mumkin",
    }),
  }),
});

module.exports = { createTaskSchema, updateTaskSchema, updateStatusSchema };
