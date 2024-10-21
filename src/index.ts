import { Command } from "commander";
import { PathLike, readFileSync, existsSync } from "fs";
import { yamlToJson } from "./lib/yamlToJson";
import { testUsingConfig } from "./commands";
import { Logger } from "tslog";

const program = new Command();
export const logger = new Logger({
  hideLogPositionForProduction: true,
});

program
  .name("vcluster-test")
  .description("vCluster Testing Tool")
  .version("0.1.0");

program
  .command("test <config-file>")
  .description("Run tests using the specified configuration file")
  .action(async (configFile: PathLike) => {
    if (!existsSync(configFile)) {
      logger.error(`The configuration file ${configFile} does not exist.`);
      process.exit(1);
    }

    try {
      const configContent = yamlToJson(readFileSync(configFile, "utf-8"));
      logger.info(`Loaded configuration from ${configFile}`);
      logger.debug(JSON.stringify(configContent, null, 2));
      await testUsingConfig(configContent);
    } catch (e) {
      const error = e as Error;
      logger.error(`Error reading configuration file: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
