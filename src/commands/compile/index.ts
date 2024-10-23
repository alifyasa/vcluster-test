import { existsSync, PathLike } from "fs";
import { readFile } from "fs/promises";
import Handlebars from "handlebars";
import { logger } from "lib/logger";
import { yamlToJson } from "lib/yamlUtils";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";

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

  return handlebarsInstance;
}

function compileYaml(yamlString: string, data: Record<string, any>): string {
  const handlebarsInstance = createHandlebarsInstance();
  const template = handlebarsInstance.compile(yamlString);
  const compiledString = template(data);
  return compiledString;
}

async function compileConfig(configPath: PathLike, valuesPath: PathLike | undefined) {
  if (!existsSync(configPath)) {
    logger.error(`The configuration file ${configPath} does not exist.`);
    process.exit(1);
  }
  if (valuesPath && !existsSync(valuesPath)) {
    logger.error(`The configuration file ${valuesPath} does not exist.`);
    process.exit(1);
  }

  const configValues = valuesPath
    ? yamlToJson(compileYaml(await readFile(valuesPath, "utf-8"), {}))
    : {};
  const configContent = yamlToJson(
    compileYaml(await readFile(configPath, "utf-8"), configValues)
  );

  return configContent;
}

export { compileConfig };
