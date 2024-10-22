import { z } from "zod";
import { timeStringToMs, urlWithoutTrailingSlash } from "../../../../lib/types";
import { TestActionParametersSchema } from "../../schema";
import { logger } from "../../../../lib/logger";
import { vclusterGet } from "./get";

const vclusterWaitSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  loftAccessKey: z.string(),
  vclusterId: z.string(),
  waitUntilPhaseEquals: z.string(),
  timeoutString: timeStringToMs,
  pollingIntervalMs: z.number().min(100),
});

async function vclusterWait(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
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
      const vcluster = await vclusterGet({
        platformHost,
        projectId,
        loftAccessKey,
        vclusterId,
      });

      if (vcluster && vcluster.status.phase === waitUntilPhaseEquals) {
        logger.info(
          `VCluster ${vclusterId} is in the desired phase: ${waitUntilPhaseEquals}`
        );
        return vcluster;
      }
    } catch (error) {
      logger.error(error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs));
  }

  throw new Error(
    `Timeout: VCluster ${vclusterId} did not reach phase ${waitUntilPhaseEquals} within ${timeoutMs} ms.`
  );
}

export { vclusterWait };
