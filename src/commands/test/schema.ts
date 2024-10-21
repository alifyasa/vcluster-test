import { z } from 'zod';
import { TEST_ACTIONS } from "./actions";

const TestActionParametersSchema = z.record(z.any()).optional();

const TestStepSchema = z.object({
  name: z.string(),
  action: z.enum(Object.keys(TEST_ACTIONS) as [keyof typeof TEST_ACTIONS]),
  parameters: TestActionParametersSchema,
});

const TestCommandSchema = z.object({
  name: z.string(),
  description: z.string(),
  steps: z.array(TestStepSchema),
  defaults: z.object({
    parameters: TestActionParametersSchema,
  }),
});

export {
    TestCommandSchema,
    TestStepSchema,
    TestActionParametersSchema
}
