import { z } from "zod";

/**
 * New-auth signin (§3.3): email + password only. Password min 8, max 32.
 */
export const loginBackendSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must not exceed 32 characters"),
});

export type LoginBackendData = z.infer<typeof loginBackendSchema>;

