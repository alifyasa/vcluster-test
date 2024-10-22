import { z } from "zod";
import { urlWithoutTrailingSlash } from "../../../../lib/types";
import axios from "axios";
import { TestActionParametersSchema } from "../../schema";
import { VirtualClusterInstanceList } from "../../../../lib/types/virtualClusterInstanceList";
import { error } from "console";
import { logger } from "../../../../lib/logger";

const vclusterListSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  loftAccessKey: z.string(),
});

async function vclusterList(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const input = vclusterListSchema.parse(parameters);
  const options = {
    method: "GET",
    url: `${input.platformHost}/kubernetes/management/apis/management.loft.sh/v1/namespaces/p-${input.projectId}/virtualclusterinstances`,
    params: { extended: "true" },
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
      Connection: "keep-alive",
      Cookie: `loft_access_key=${input.loftAccessKey}`,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=4",
      TE: "trailers",
    },
  };

  const axiosResponse = await axios.request(options);
  logger.silly(JSON.stringify(axiosResponse, null, 2))
  const requestSuccessful = axiosResponse.status === 200;
  if (!requestSuccessful) {
    throw new Error(
      `vCluster List Request Failed: ${axiosResponse.status} ${axiosResponse.statusText}`
    );
  }
  const vclusterInstanceList: VirtualClusterInstanceList = axiosResponse.data;
  return vclusterInstanceList;
}

export { vclusterList };
