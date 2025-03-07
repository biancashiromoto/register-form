import { z } from 'zod';

const countryAndStateSchema = z.object({
  name: z.string(),
  isoCode: z.string(),
});

const citySchema = z.object({
  name: z.string(),
});

export const secondStepSchema = z.object({
  country: countryAndStateSchema,
  state: countryAndStateSchema,
  city: citySchema,
});
