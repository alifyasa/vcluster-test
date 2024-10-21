import { z } from "zod";
import { timeStringToMs, urlWithoutTrailingSlash } from "../../../../lib/types";
import { TestActionParametersSchema } from "../../schema";
import { vclusterList } from "./list";
import { logger } from "../../../..";

const vclusterWaitSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  loftAccessKey: z.string(),
  vclusterId: z.string(),
  waitUntilPhaseEquals: z.string(),
  timeoutString: timeStringToMs,
  pollingIntervalMs: z.number().min(100),
});

async function vclusterWait(parameters: z.infer<typeof TestActionParametersSchema>) {
  const {
    platformHost,
    projectId,
    loftAccessKey,
    vclusterId,
    waitUntilPhaseEquals,
    timeoutString: timeoutMs,
    pollingIntervalMs,
  } = vclusterWaitSchema.parse(parameters);

  const endTime = Date.now() + timeoutMs;

  while (Date.now() < endTime) {
    try {
      const response = await vclusterList({
        platformHost,
        projectId,
        loftAccessKey
      });
      const vcluster = response.data.items.find(
        (item: any) => item.metadata.name === vclusterId
      );

      if (vcluster && vcluster.status.phase === waitUntilPhaseEquals) {
        logger.info(
          `VCluster ${vclusterId} is in the desired phase: ${waitUntilPhaseEquals}`
        );
        return vcluster;
      }
      logger.info(
        `VCluster ${vclusterId} is in phase: ${vcluster.status.phase}`
      );
    } catch (error) {
      logger.error("Error fetching vCluster status:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs));
  }

  throw new Error(
    `Timeout: VCluster ${vclusterId} did not reach phase ${waitUntilPhaseEquals} within ${timeoutMs} ms.`
  );
}

export { vclusterWait };
