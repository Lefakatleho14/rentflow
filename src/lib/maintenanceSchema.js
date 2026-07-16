import { z } from "zod";

export const maintenanceSchema = z.object({
  issue: z.string().min(3, "Describe the issue briefly"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "emergency"]),
});