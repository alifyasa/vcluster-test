import { z } from "zod";
import axios, { AxiosError } from "axios";
import { logger } from "lib/logger";
import { TestActionParametersSchema } from "commands/test/schema";
import { urlWithoutTrailingSlash } from "lib/types";

const templateDeleteSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  loftAccessKey: z.string(),
  templateId: z.string(),
});

async function templateDelete(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const { platformHost, loftAccessKey, templateId } =
    templateDeleteSchema.parse(parameters);
  const options = {
    method: "DELETE",
    url: `${platformHost}/kubernetes/management/apis/management.loft.sh/v1/virtualclustertemplates/${templateId}`,
    params: { timeout: "180s" },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer: `${platformHost}/vclustertemplates`,
      authorization:
        `bearer ${loftAccessKey}`,
      "x-platform-client": "true",
      "x-sleep-mode-ignore": "true",
      Origin: platformHost,
      Connection: "keep-alive",
      Cookie:
        `loft_access_key=${loftAccessKey}`,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
      TE: "trailers",
    },
  };

  try {
    const axiosResponse = await axios.request(options);
    logger.silly(JSON.stringify(axiosResponse.headers, null, 2));
    logger.silly(JSON.stringify(axiosResponse.data, null, 2));
    logger.info(`Successfully Created vCluster Template`);
    return true;
  } catch (e) {
    if (!(e instanceof AxiosError)) throw e;
    throw new Error(
      `Failed creating vCluster Template: ${JSON.stringify(
        e.toJSON(),
        null,
        2
      )}`
    );
  }
}

export { templateDelete };
