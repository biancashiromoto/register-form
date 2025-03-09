import { isUserAdult, passwordValidation } from '@/helpers';
import { z } from 'zod';

export const userRegisterSchema = z
  .object({
    firstName: z
      .string({
        required_error: 'First name is required',
      })
      .min(2, 'First name must have at least 2 characters')
      .max(50, 'First name must have at most 50 characters')
      .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters')
      .transform(
        (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
      ),
    lastName: z
      .string({
        required_error: 'Last name is required',
      })
      .min(2, 'Last name must have at least 2 characters')
      .max(50, 'Last name must have at most 50 characters')
      .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters')
      .transform(
        (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
      ),
    birthDate: z
      .string({
        required_error: 'Birth date is required',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid birth date',
      })
      .refine(
        (val) =>
          new Date(val) >= new Date(new Date().getFullYear() - 100, 0, 1),
        'Birth date cannot be more than 100 years ago',
      )
      .refine((val) => isUserAdult(val), {
        message: 'User must be at least 18 years old',
      }),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email'),
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
