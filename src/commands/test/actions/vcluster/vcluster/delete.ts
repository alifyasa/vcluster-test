import { z } from "zod";
import axios from "axios";
import { urlWithoutTrailingSlash } from "lib/types";
import { TestActionParametersSchema } from "commands/test/schema";
import { logger } from "lib/logger";

const vclusterDeleteSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  vclusterId: z.string(),
  loftAccessKey: z.string(),
});

async function vclusterDelete(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const input = vclusterDeleteSchema.parse(parameters);
  const options = {
    method: "DELETE",
    url: `${input.platformHost}/kubernetes/management/apis/management.loft.sh/v1/namespaces/p-${input.projectId}/virtualclusterinstances/${input.vclusterId}`,
    params: { timeout: "180s" },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer: `${input.platformHost}/projects/${input.projectId}/vclusters`,
      authorization: `bearer ${input.loftAccessKey}`,
      "x-platform-client": "true",
      "x-sleep-mode-ignore": "true",
      Origin: input.loftAccessKey,
      Connection: "keep-alive",
      Cookie: `loft_access_key=${input.loftAccessKey}`,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
      TE: "trailers",
    },
  };

  const axiosResponse = await axios.request(options);
  logger.silly(JSON.stringify(axiosResponse.headers, null, 2))
  logger.silly(JSON.stringify(axiosResponse.data, null, 2))
  const vclusterDeleted = axiosResponse.status === 200;
  if (vclusterDeleted)
    logger.info(
      `Successfully Deleted vCluster ${input.vclusterId} in Project ${input.projectId}`
    );
  return vclusterDeleted;
}

export { vclusterDelete };
