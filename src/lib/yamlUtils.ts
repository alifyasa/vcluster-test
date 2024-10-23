import * as yaml from "js-yaml";
import { logger } from "lib/logger";

function yamlToJson(yamlString: string): Record<string, any> {
  try {
    const data = yaml.load(yamlString);
    return data as object;
  } catch (error) {
    logger.error("Error parsing YAML file:", error);
    throw error;
  }
}

function jsonToYaml(jsonString: Record<string, any>): string {
  try {
    const data = yaml.dump(jsonString);
    return data;
  } catch (error) {
    logger.error("Error parsing JSON:", error);
    throw error;
  }
}

export { yamlToJson, jsonToYaml };
