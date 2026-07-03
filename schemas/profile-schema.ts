// schemas/profile-schema.ts

import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be less than 50 characters."),

  image: z
    .string()
    .trim()
    .url("Please enter a valid image URL.")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;