import { TEST_ACTIONS } from "commands/test/actions";
import { z } from "zod";

const TestActionParametersSchema = z.record(z.any()).optional();

const TestStepSchema = z.object({
  name: z.string(),
  action: z.enum(Object.keys(TEST_ACTIONS) as [keyof typeof TEST_ACTIONS]),
  parameters: TestActionParametersSchema,
});

const TestStepSchemaWithCleanup = TestStepSchema.extend({
  cleanupSteps: z.array(TestStepSchema).optional().default([]),
});

const TestCommandSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  steps: z.array(TestStepSchemaWithCleanup),
  defaults: z.object({
    parameters: TestActionParametersSchema,
  }),
});

export { TestCommandSchema, TestStepSchema, TestActionParametersSchema };
