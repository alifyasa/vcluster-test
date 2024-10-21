import { z } from "zod";
import { TestActionParametersSchema } from "../../schema";
import { useLogger } from "../../../../lib/logger";
import { $ } from "execa";

const { logger } = useLogger();

const shellExecuteSchema = z.object({
  shellCommand: z.string().transform(str => str.split('\n')),
  env: z.record(z.string()).optional(),
});

async function shellExecute(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const input = shellExecuteSchema.parse(parameters);
  logger.info(`Executing ${JSON.stringify(input.shellCommand, null, 2)}`);
  for (const line of input.shellCommand) {
    const execResult = await $(`${line}`, {
      env: {
        ...process.env,
        ...input.env,
        
      }
    });
    logger.info(execResult.stdout);
  }
}

export { shellExecute };
