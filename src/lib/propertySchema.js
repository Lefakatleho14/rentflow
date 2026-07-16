import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  property_type: z.enum(["apartment", "house", "townhouse", "studio", "room"]),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(1, "Select a province"),
  postal_code: z.string().optional(),
  monthly_rent: z.coerce.number().min(0, "Rent cannot be negative"),
  deposit: z.coerce.number().min(0, "Deposit cannot be negative").optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  parking: z.coerce.number().int().min(0).optional(),
  square_meters: z.coerce.number().min(0).optional(),
  status: z.enum(["available", "occupied", "maintenance"]),
});