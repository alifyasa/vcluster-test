import { TEST_ACTIONS } from "commands/test/actions";
import { TestCommandSchema, TestStepSchema } from "commands/test/schema";
import { logger } from "lib/logger";
import { z } from "zod";

async function testUsingConfig(config: object) {
  const commandConfig = TestCommandSchema.parse(config);
  if (!commandConfig) {
    logger.error("Failed parsing config");
    logger.debug(JSON.stringify(config, null, 2));
    return;
  }
  let rollbackSteps: z.infer<typeof TestStepSchema>[] = [];
  try {
    for (const step of commandConfig.steps) {
      logger.info(`Executing Step ${step.name} (${step.action})`);
      await TEST_ACTIONS[step.action]({
        ...commandConfig.defaults.parameters,
        ...step.parameters,
      });
      rollbackSteps = [...step.cleanupSteps, ...rollbackSteps];
      logger.debug(JSON.stringify(rollbackSteps));
    }
    logger.info("Finished executing. Cleaning Up.");
  } catch (error) {
    const err = error as Error
    logger.error(err.message)
    logger.info("Encountered an error. Cleaning Up.");
  }

  try {
    for (const rollbackStep of rollbackSteps) {
      logger.info(
        `Executing Step ${rollbackStep.name} (${rollbackStep.action})`
      );
      await TEST_ACTIONS[rollbackStep.action]({
        ...commandConfig.defaults.parameters,
        ...rollbackStep.parameters,
      });
    }
    logger.info("Finished cleaning up. Thank you.");
  } catch (error) {
    logger.error(error)
    logger.info("Encountered an error. Stopping.");
  }
}

export { testUsingConfig };
