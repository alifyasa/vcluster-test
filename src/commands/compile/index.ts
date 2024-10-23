import { existsSync, PathLike } from "fs";
import { readFile } from "fs/promises";
import Handlebars from "handlebars";
import { logger } from "lib/logger";
import { jsonToYaml, yamlToJson } from "lib/yamlUtils";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";

async function compile(configPath: PathLike, valuesPath: PathLike | undefined) {
  try {
    const configContent = await compileConfig(configPath, valuesPath)
    logger.info(`Compiled Script\n${JSON.stringify(configContent, null, 2)}`);
  } catch (e) {
    const error = e as Error;
    logger.error(error.message);
    process.exit(1);
  }
}

function createHandlebarsInstance(): typeof Handlebars {
  const handlebarsInstance = Handlebars.create();

  handlebarsInstance.registerHelper("uuidv4", () => uuidv4());
  handlebarsInstance.registerHelper("shortId", () => {
    return customAlphabet("0123456789qwertyuiopasdfghjklzxcvbnm", 4)();
  });
  handlebarsInstance.registerHelper("utcTimestamp", () =>
    new Date().toISOString()
  );
  handlebarsInstance.registerHelper("unixTimestamp", () =>
    Math.floor(Date.now() / 1000)
  );
  handlebarsInstance.registerHelper("toYaml", (data, indent = 0) => {
    const yamlString = jsonToYaml(data).trimEnd();
    const indentSpaces = " ".repeat(indent);
    return yamlString
      .split("\n")
      .map((line) => `${indentSpaces}${line}`)
      .join("\n");
  });
  handlebarsInstance.registerHelper("nindent", (text, indent = 0) => {
    const indentSpaces = " ".repeat(indent);
    return text
      .split("\n")
      .map((line: string) => `${indentSpaces}${line}`)
      .join("\n");
  });

  return handlebarsInstance;
}

function compileYaml(yamlString: string, data: Record<string, any>): string {
  const handlebarsInstance = createHandlebarsInstance();
  const template = handlebarsInstance.compile(yamlString);
  const compiledString = template(data);
  return compiledString;
}

async function compileConfig(
  configPath: PathLike,
  valuesPath: PathLike | undefined
) {
  if (!existsSync(configPath)) {
    logger.error(`The configuration file ${configPath} does not exist.`);
    process.exit(1);
  }
  if (valuesPath && !existsSync(valuesPath)) {
    logger.error(`The configuration file ${valuesPath} does not exist.`);
    process.exit(1);
  }

  let configValues = {};
  if (valuesPath) {
    const valuesFile = await readFile(valuesPath, "utf-8");
    const valuesCompiled = compileYaml(valuesFile, {});
    configValues = yamlToJson(valuesCompiled);

    logger.debug(valuesFile);
    logger.debug(valuesCompiled);
    logger.debug(configValues);
  }

  const configFile = await readFile(configPath, "utf-8");
  const configCompiled = compileYaml(configFile, configValues);
  const configContent = yamlToJson(configCompiled);

  logger.debug(configFile);
  logger.debug(configCompiled);
  logger.debug(configContent);

  return configContent;
}

export { compileConfig, compile };
