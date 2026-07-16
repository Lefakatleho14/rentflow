import { z } from "zod";

export const leaseSchema = z
  .object({
    tenant_email: z.string().email("Enter a valid email"),
    lease_start: z.string().min(1, "Start date is required"),
    lease_end: z.string().min(1, "End date is required"),
    monthly_rent: z.coerce.number().min(0, "Rent cannot be negative"),
    deposit: z.coerce.number().min(0).optional(),
    emergency_contact_name: z.string().optional(),
    emergency_contact_phone: z.string().optional(),
  })
  .refine((data) => new Date(data.lease_end) > new Date(data.lease_start), {
    message: "End date must be after start date",
    path: ["lease_end"],
  });