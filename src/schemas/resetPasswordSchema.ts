import { passwordValidation } from '@/helpers';
import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    password: z
      .string({ required_error: 'Password is required' })
      .regex(passwordValidation, {
        message:
          'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and confirm password must match',
  });
