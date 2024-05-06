import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
  device_details: z.any(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
  name: z.string(). min(3).max(128),
  twofactor: z.boolean(),
  device_details: z.any(),
});
