import { z } from 'zod';

export const secondStepSchema = z.object({
  country: z
    .object({
      name: z.string(),
      isoCode: z.string(),
    })
    .refine((val) => val !== undefined, { message: 'Country is required' }),
  state: z
    .object({
      name: z.string(),
      isoCode: z.string(),
    })
    .refine((val) => val !== undefined, { message: 'State is required' }),
  city: z
    .object({
      name: z.string(),
      isoCode: z.string(),
    })
    .refine((val) => val !== undefined, { message: 'City is required' }),
});
