import { isUserAdult } from '@/helpers';
import { z } from 'zod';

export const firstStepSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
    })
    .min(2, 'First name must have at least 2 characters')
    .max(50, 'First name must have at most 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters'),
  lastName: z
    .string({
      required_error: 'Last name is required',
    })
    .min(2, 'Last name must have at least 2 characters')
    .max(50, 'Last name must have at most 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters'),
  birthDate: z
    .string({
      required_error: 'Birth date is required',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid birth date',
    })
    .refine(
      (val) => new Date(val) >= new Date(new Date().getFullYear() - 100, 0, 1),
      'Birth date cannot be more than 100 years ago',
    )
    .refine((val) => isUserAdult(val), {
      message: 'User must be at least 18 years old',
    }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email'),
  countryCode: z.string({
    required_error: 'Country code is required',
  }),
  phone: z
    .string({
      required_error: 'Phone is required',
    })
    .min(8, 'Invalid phone number'),
});
