import { z } from "zod";
import { TestActionParametersSchema } from "../../schema";
import { useLogger } from "../../../../lib/logger";
import path from "path";
import { v4 } from "uuid";
import { chmod, unlink, writeFile } from "fs/promises";
import { execa } from "execa";

const { logger } = useLogger();

const shellExecuteScriptSchema = z.object({
  script: z.string(),
  env: z.record(z.string()).optional(),
});

async function shellExecuteScript(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const input = shellExecuteScriptSchema.parse(parameters);
  const scriptPath = path.join("/tmp", `${v4()}.sh`);
  await writeFile(scriptPath, input.script);
  await chmod(scriptPath, "755");
  logger.info(`Executing ${input.script}`);
  const execaResult = await execa(scriptPath, {
    shell: true,
    env: {
      ...process.env,
      ...input.env,
    },
  });
  logger.info(execaResult.stdout)
  logger.error(execaResult.stderr)
  await unlink(scriptPath)
}

export { shellExecuteScript };
