import Handlebars from "handlebars";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";

function createHandlebarsInstance(): typeof Handlebars {
  const handlebarsInstance = Handlebars.create();

  handlebarsInstance.registerHelper("uuidv4", () => uuidv4());
  handlebarsInstance.registerHelper("shortId", () => {
    return customAlphabet("0123456789qwertyuiopasdfghjklzxcvbnm", 4)()
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

export { compileYaml };
