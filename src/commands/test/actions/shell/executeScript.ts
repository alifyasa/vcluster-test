import { z } from "zod";
import { TestActionParametersSchema } from "../../schema";
import { logger } from "../../../../lib/logger";
import path from "path";
import { v4 } from "uuid";
import { chmod, unlink, writeFile } from "fs/promises";
import { execa } from "execa";

const shellExecuteScriptSchema = z.object({
  script: z.string().transform((script) => script.trim()),
  env: z.record(z.any().transform(anything => anything.toString())).optional(),
  saveStdoutTo: z.string().optional(),
});

async function shellExecuteScript(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const input = shellExecuteScriptSchema.parse(parameters);
  const scriptPath = path.join("/tmp", `${v4()}.sh`);
  await writeFile(scriptPath, input.script);
  await chmod(scriptPath, "755");
  logger.debug(`Executing Script\n${input.script}`);
  const execaResult = await execa(scriptPath, {
    shell: true,
    env: {
      ...process.env,
      ...input.env,
    },
  });
  if (execaResult.stdout) logger.info(`Shell STDOUT\n${execaResult.stdout}`);
  if (input.saveStdoutTo) {
    await writeFile(input.saveStdoutTo, execaResult.stdout || "");
    logger.info(`Saved STDOUT to ${input.saveStdoutTo}`);
  }
  if (execaResult.stderr && execaResult.exitCode !== -1) {
    logger.warn(`Shell STDERR\n${execaResult.stderr}`);
  }
  if (execaResult.exitCode === -1) {
    logger.error(`Shell STDERR\n${execaResult.stderr}`);
    throw new Error(
      `Shell Execute exited with error code ${execaResult.exitCode}`
    );
  }

  await unlink(scriptPath);

  return execaResult;
}

export { shellExecuteScript };
