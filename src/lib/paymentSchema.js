import { z } from "zod";

const currentYear = new Date().getFullYear();

export const paymentSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020).max(currentYear + 1),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
  status: z.enum(["pending", "paid", "overdue"]),
  payment_method: z.enum(["eft", "cash", "card", "other"]).optional(),
  reference_number: z.string().optional(),
  payment_date: z.string().optional(),
});