import z from 'zod';

export const addNewUserValidationSchema = z.object({
  email: z.string().email(),
  role: z.string(),
});
