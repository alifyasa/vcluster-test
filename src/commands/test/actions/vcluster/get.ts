import { z } from "zod";
import { urlWithoutTrailingSlash } from "../../../../lib/types";
import axios from "axios";
import { TestActionParametersSchema } from "../../schema";
import { vclusterList } from "./list";
import { logger } from "../../../../lib/logger";

const vclusterGetSchema = z.object({
  platformHost: urlWithoutTrailingSlash,
  projectId: z.string(),
  loftAccessKey: z.string(),
  vclusterId: z.string(),
});

async function vclusterGet(
  parameters: z.infer<typeof TestActionParametersSchema>
) {
  const { platformHost, projectId, loftAccessKey, vclusterId } =
    vclusterGetSchema.parse(parameters);
  try {
    const response = await vclusterList({
      platformHost,
      projectId,
      loftAccessKey,
    });
    const vcluster = response.data.items.find(
      (item: any) => item.metadata.name === vclusterId
    );
    return vcluster;
  } catch (error) {
    logger.error("Error fetching vCluster status:", error);
    throw new Error(`Error fetching vCluster status: ${error}`);
  }
}

export { vclusterGet };
