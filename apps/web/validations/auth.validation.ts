import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const signInValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpValidationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
});
