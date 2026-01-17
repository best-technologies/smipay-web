import { z } from "zod";

/**
 * Login Schema - Supports both email and phone number
 */
export const loginBackendSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .trim()
      .optional()
      .or(z.literal("")),
    phone_number: z
      .string()
      .regex(
        /^(\+?234|234|0)?[789][01]\d{8}$/,
        "Invalid Nigerian phone number"
      )
      .transform((val) => {
        if (!val) return "";
        // Normalize to 234XXXXXXXXXX format
        let cleaned = val.replace(/\D/g, "");
        if (cleaned.startsWith("0")) {
          cleaned = "234" + cleaned.substring(1);
        } else if (cleaned.startsWith("234")) {
          return cleaned;
        }
        return "234" + cleaned;
      })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters"),
  })
  .refine((data) => data.email || data.phone_number, {
    message: "Either email or phone number is required",
    path: ["email"],
  });

export type LoginBackendData = z.infer<typeof loginBackendSchema>;

