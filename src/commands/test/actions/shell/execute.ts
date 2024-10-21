import { z } from "zod";
import { TestActionParametersSchema } from "../../schema";
import { useLogger } from "../../../../lib/logger";
import { execaCommand } from "execa";

const { logger } = useLogger();

const shellExecuteSchema = z.object({
  shellCommand: z.string(),
});

async function shellExecute(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
    const input = shellExecuteSchema.parse(parameters)
    logger.info(`Executing ${input.shellCommand}`)
    const execResult = await execaCommand(input.shellCommand)
    logger.info(execResult.stdout)
    return execResult
}

export {
    shellExecute
}
