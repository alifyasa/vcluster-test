import { z } from "zod";
import axios, { AxiosError } from "axios";
import { logger } from "lib/logger";
import { TestActionParametersSchema } from "commands/test/schema";
import { urlWithoutTrailingSlash } from "lib/types";

const vclusterCreateSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  vclusterId: z.string(),
  templateId: z.string(),
  clusterId: z.string(),
  loftAccessKey: z.string(),
});

async function vclusterCreate(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const input = vclusterCreateSchema.parse(parameters);
  const options = {
    method: "POST",
    url: `${input.platformHost}/kubernetes/management/apis/management.loft.sh/v1/namespaces/p-${input.projectId}/virtualclusterinstances`,
    params: { timeout: "180s" },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer: `${input.platformHost}/projects/${input.projectId}/vclusters`,
      authorization: `bearer ${input.loftAccessKey}`,
      "content-type": "application/json",
      "x-platform-client": "true",
      "x-sleep-mode-ignore": "true",
      Origin: `${input.platformHost}`,
      Connection: "keep-alive",
      Cookie: `loft_access_key=${input.loftAccessKey}`,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
      TE: "trailers",
    },
    data: {
      apiVersion: "management.loft.sh/v1",
      kind: "VirtualClusterInstance",
      metadata: { name: input.vclusterId },
      spec: {
        templateRef: { name: input.templateId },
        clusterRef: { cluster: input.clusterId },
      },
    },
  };

  try {
    const axiosResponse = await axios.request(options);
    logger.silly(JSON.stringify(axiosResponse.headers, null, 2));
    logger.silly(JSON.stringify(axiosResponse.data, null, 2));
    logger.info(
      `Successfully Created vCluster ${input.vclusterId} using Template ${input.templateId} in Project ${input.projectId}`
    );
    return true;
  } catch (e) {
    const error = e as AxiosError;
    throw new Error(
      `Failed creating vCluster: ${JSON.stringify(error.toJSON(), null, 2)}`
    );
  }
}

export { vclusterCreate };
