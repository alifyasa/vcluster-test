import Handlebars from "handlebars";
import { customAlphabet, urlAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";

function createHandlebarsInstance(): typeof Handlebars {
  const handlebarsInstance = Handlebars.create();

  handlebarsInstance.registerHelper("uuidv4", () => uuidv4());
  handlebarsInstance.registerHelper("nanoid", () =>
    customAlphabet(urlAlphabet, 8)
  );
  handlebarsInstance.registerHelper("utcTimestamp", () =>
    new Date().toISOString()
  );

  return handlebarsInstance;
}

function compileYaml(yamlString: string, data: Record<string, any>): string {
  const handlebarsInstance = createHandlebarsInstance();
  const template = handlebarsInstance.compile(yamlString);
  const compiledString = template(data);
  return compiledString;
}

export { compileYaml };
