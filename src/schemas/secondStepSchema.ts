import { z } from 'zod';

export const secondStepSchema = z.object({
  country: z.string({
    required_error: 'Country is required',
  }),
  state: z.string({
    required_error: 'State is required',
  }),
  city: z.string({
    required_error: 'City is required',
  }),
});
