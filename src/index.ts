import { Command } from "commander";
import { testUsingConfig } from "commands";
import { compileConfig } from "commands/compile";
import { PathLike } from "fs";
import { logger, setLogger } from "lib/logger";

const program = new Command();

program
  .name("vcluster-test")
  .description("vCluster Testing Tool")
  .version("0.1.0");

program.option("-d, --debug", "Output debugging information.");

program
  .command("test <config-file> [values-file]")
  .description("Run tests using the specified configuration file")
  .action(async (configPath: PathLike, valuesPath: PathLike | undefined) => {
    try {
      const configContent = compileConfig(configPath, valuesPath)
      logger.info(`Loaded configuration from ${configPath}`);
      logger.debug(JSON.stringify(configContent, null, 2));
      await testUsingConfig(configContent);
    } catch (e) {
      const error = e as Error;
      logger.error(error.message);
      process.exit(1);
    }
  });

program
  .command("compile <config-file> [values-file]")
  .description("Compile configuration file with the values file")
  .action(async (configPath: PathLike, valuesPath: PathLike | undefined) => {
    try {
      const configContent = compileConfig(configPath, valuesPath)
      logger.info(JSON.stringify(configContent, null, 2));
    } catch (e) {
      const error = e as Error;
      logger.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
const options = program.opts();
setLogger({
  minLevel: options.debug ? 2 : 3,
});
