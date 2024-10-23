import { z } from "zod";
import { timeStringToMs, urlWithoutTrailingSlash } from "lib/types";
import { TestActionParametersSchema } from "commands/test/schema";
import { logger } from "lib/logger";
import { vclusterGet } from "commands/test/actions/vcluster/vcluster/get";

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
  logger.info(
    `Waiting vCluster ${vclusterId} to be in the phase ${waitUntilPhaseEquals} within ${timeoutMs}ms`
  );

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
          `vCluster ${vclusterId} is in the desired phase: ${waitUntilPhaseEquals}`
        );
        return vcluster;
      }
    } catch (error) {
      logger.error(error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs));
  }

  throw new Error(
    `Timeout: vCluster ${vclusterId} did not reach phase ${waitUntilPhaseEquals} within ${timeoutMs} ms.`
  );
}

export { vclusterWait };
