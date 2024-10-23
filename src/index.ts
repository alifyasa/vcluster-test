import { Command } from "commander";
import { testUsingConfig } from "commands";
import { compileYaml } from "commands/compile";
import { PathLike, readFileSync, existsSync } from "fs";
import { logger, setLogger } from "lib/logger";
import { yamlToJson } from "lib/yamlUtils";

const program = new Command();

program
  .name("vcluster-test")
  .description("vCluster Testing Tool")
  .version("0.1.0");

program.option("-d, --debug", "Output debugging information.");

program
  .command("test <config-file> [values-file]")
  .description("Run tests using the specified configuration file")
  .action(async (configFile: PathLike, valuesFile: PathLike | undefined) => {
    if (!existsSync(configFile)) {
      logger.error(`The configuration file ${configFile} does not exist.`);
      process.exit(1);
    }

    if (valuesFile && !existsSync(valuesFile)) {
      logger.error(`The configuration file ${valuesFile} does not exist.`);
      process.exit(1);
    }

    try {
      const configValues = valuesFile
        ? yamlToJson(readFileSync(valuesFile, "utf-8"))
        : {};
      const configContent = yamlToJson(
        compileYaml(readFileSync(configFile, "utf-8"), configValues)
      );
      logger.info(`Loaded configuration from ${configFile}`);
      logger.debug(JSON.stringify(configContent, null, 2));
      await testUsingConfig(configContent);
    } catch (e) {
      const error = e as Error;
      logger.error(`Error reading configuration file: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("compile <config-file> [values-file]")
  .description("Compile configuration file with the values file")
  .action(async (configFile: PathLike, valuesFile: PathLike | undefined) => {
    if (!existsSync(configFile)) {
      logger.error(`The configuration file ${configFile} does not exist.`);
      process.exit(1);
    }

    if (valuesFile && !existsSync(valuesFile)) {
      logger.error(`The configuration file ${valuesFile} does not exist.`);
      process.exit(1);
    }

    try {
      const configValues = valuesFile
        ? yamlToJson(readFileSync(valuesFile, "utf-8"))
        : {};
      const configContent = yamlToJson(
        compileYaml(readFileSync(configFile, "utf-8"), configValues)
      );
      logger.info(JSON.stringify(configContent, null, 2));
    } catch (e) {
      const error = e as Error;
      logger.error(`Error reading configuration file: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
const options = program.opts();
setLogger({
  minLevel: options.debug ? 2 : 3,
});
