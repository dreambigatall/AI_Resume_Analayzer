// src/lib/validators.ts
import { z } from 'zod';

// Login form validation schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// Signup form validation schema
export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignupFormData = z.infer<typeof SignupSchema>;

export const JobSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  descriptionText: z.string().min(10, { message: "Description must be at least 10 characters." }),
  mustHaveSkills: z.string().optional(), // Input as comma-separated string
  focusAreas: z.string().optional(),     // Input as comma-separated string
});

export type JobFormData = z.infer<typeof JobSchema>;