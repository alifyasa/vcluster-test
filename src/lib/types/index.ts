import { z } from "zod";
import ms from "ms";

const urlWithoutTrailingSlash = z
  .string()
  .url()
  .transform((url) => (url.endsWith("/") ? url.slice(0, -1) : url));

const timeStringToMs = z.string().transform((str) => ms(str));

export { urlWithoutTrailingSlash, timeStringToMs };
