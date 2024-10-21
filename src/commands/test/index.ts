import { useLogger } from "../../lib/logger";
import { TEST_ACTIONS } from "./actions";
import { TestCommandSchema } from "./schema";

const { logger } = useLogger();

async function testUsingConfig(config: object) {
  const commandConfig = TestCommandSchema.parse(config);
  if (!commandConfig) {
    logger.error("Failed parsing config")
    logger.debug(JSON.stringify(config, null, 2))
    return
  }
  for (const step of commandConfig.steps) {
    logger.info(`Executing Step ${step.name} (${step.action})`)
    await TEST_ACTIONS[step.action]({
      ...commandConfig.defaults.parameters,
      ...step.parameters
    })
  }
}

export { testUsingConfig };
