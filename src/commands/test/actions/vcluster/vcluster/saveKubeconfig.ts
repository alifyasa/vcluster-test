import { z } from "zod";
import axios, { AxiosError } from "axios";
import path from "path";
import { urlWithoutTrailingSlash } from "lib/types";
import { TestActionParametersSchema } from "commands/test/schema";
import { logger } from "lib/logger";
import { writeFile } from "fs/promises";

const vclusterSaveKubeconfigSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  loftAccessKey: z.string(),
  vclusterId: z.string(),
  savePath: z.string().refine(
    (str) => {
      return path.isAbsolute(str);
    },
    { message: "Must be an absolute path" }
  ),
});

async function vclusterSaveKubeconfig(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const input = vclusterSaveKubeconfigSchema.parse(parameters);
  const options = {
    method: "POST",
    url: `${input.platformHost}/kubernetes/management/apis/management.loft.sh/v1/namespaces/p-${input.projectId}/virtualclusterinstances/${input.vclusterId}/kubeconfig`,
    params: { timeout: "180s" },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer: `${input.platformHost}/projects/${input.projectId}/vclusters/${input.vclusterId}/config?tab=inspect-resources`,
      authorization: `bearer ${input.loftAccessKey}`,
      "content-type": "application/json",
      "x-platform-client": "true",
      "x-sleep-mode-ignore": "true",
      Origin: input.platformHost,
      Connection: "keep-alive",
      Cookie: `loft_access_key=${input.loftAccessKey}`,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=4",
      TE: "trailers",
    },
    data: {
      apiVersion: "management.loft.sh/v1",
      kind: "VirtualClusterInstanceKubeConfig",
      metadata: {},
      spec: { certificateTTL: 315360000 },
    },
  };

  let kubeconfig: string;
  try {
    const axiosResponse = await axios.request(options);
    logger.silly(JSON.stringify(axiosResponse.headers, null, 2));
    logger.silly(JSON.stringify(axiosResponse.data, null, 2));
    kubeconfig = axiosResponse.data.status.kubeConfig;
  } catch (e) {
    const error = e as AxiosError;
    throw new Error(
      `Error getting KubeConfig: ${JSON.stringify(error.toJSON(), null, 2)}`
    );
  }
  await writeFile(input.savePath, kubeconfig)
  logger.info(`Kubeconfig written successfully to ${input.savePath}!`);
  return true;
}

export { vclusterSaveKubeconfig };
