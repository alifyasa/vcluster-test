import { z } from "zod";
import axios, { AxiosError } from "axios";
import { urlWithoutTrailingSlash } from "lib/types";
import { TestActionParametersSchema } from "commands/test/schema";
import { logger } from "lib/logger";
import { vclusterGet } from "commands/test/actions/vcluster/vcluster/get";

const vclusterChangeTemplateSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  loftAccessKey: z.string(),
  vclusterId: z.string(),
  targetTemplateId: z.string(),
});

async function vclusterChangeTemplate(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const {
    platformHost,
    projectId,
    loftAccessKey,
    vclusterId,
    targetTemplateId,
  } = vclusterChangeTemplateSchema.parse(parameters);

  const vcluster = await vclusterGet({
    platformHost,
    projectId,
    loftAccessKey,
    vclusterId,
  });
  if (!vcluster) {
    throw new Error(
      `Cannot find vCluster ${vclusterId} in project ${projectId}`
    );
  }
  const oldTemplate = vcluster.spec.templateRef["name"];
  vcluster.spec.templateRef["name"] = targetTemplateId;
  vcluster.spec.templateRef["syncOnce"] = true;

  const options = {
    method: "PUT",
    url: `${platformHost}/kubernetes/management/apis/management.loft.sh/v1/namespaces/p-${projectId}/virtualclusterinstances/${vclusterId}`,
    params: { timeout: "180s" },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer:
        `${platformHost}/projects/${projectId}/vclusters`,
      authorization:
        `bearer ${loftAccessKey}`,
      "content-type": "application/json",
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
    data: vcluster,
  };
  try {
    const axiosResponse = await axios.request(options);
    logger.silly(JSON.stringify(axiosResponse.headers, null, 2));
    logger.silly(JSON.stringify(axiosResponse.data, null, 2));
    logger.info(
      `Successfully Changed vCluster template of ${vclusterId} in project ${projectId} from ${oldTemplate} to ${targetTemplateId}`
    );
    return true;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(
        `Failed changing template for vCluster: ${JSON.stringify(
          e.toJSON(),
          null,
          2
        )}`
      );
    } else {
      throw e
    }
  }
}

export { vclusterChangeTemplate };
