import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });