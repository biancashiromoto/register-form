import { z } from 'zod';
import { firstStepSchema } from './firstStepSchema';
import { secondStepSchema } from './secondStepSchema';

export const userSchema = z.object({
  firstStep: firstStepSchema,
  secondStep: secondStepSchema,
});
