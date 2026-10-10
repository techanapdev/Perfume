import {z} from 'zod';

const email = z.string().trim().toLowerCase().pipe(z.email().max(254));
// bcrypt (Supabase) ignores bytes beyond 72
const newPassword = z.string().min(8).max(72);

export const loginSchema = z.object({email, password: z.string().min(1).max(72)});
export const resendSchema = z.object({email});
export const registerSchema = z
  .object({email, password: newPassword, confirmPassword: z.string()})
  .refine((value) => value.password === value.confirmPassword, {path: ['confirmPassword']});
