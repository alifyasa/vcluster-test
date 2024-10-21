import { z } from "zod";
import { TestActionParametersSchema } from "../../schema";
import { useLogger } from "../../../../lib/logger";
import execa from "execa";

const { logger } = useLogger();

const shellExecuteSchema = z.object({
  shellCommand: z.string(),
});

async function shellExecute(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
    const input = shellExecuteSchema.parse(parameters)
    logger.info(`Executing ${input.shellCommand}`)
    return await execa.execaCommand(input.shellCommand)
}

export {
    shellExecute
}
