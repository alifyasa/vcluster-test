import { z } from "zod";
import { urlWithoutTrailingSlash } from "lib/types";
import { TestActionParametersSchema } from "commands/test/schema";
import { vclusterList } from "commands/test/actions/vcluster/vcluster/list";
import { logger } from "lib/logger";

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
  const response = await vclusterList({
    platformHost,
    projectId,
    loftAccessKey,
  });
  const vcluster = response.items.find(
    (item) => item.metadata.name === vclusterId
  );
  logger.silly(JSON.stringify(vcluster, null, 2))
  return vcluster;
}

export { vclusterGet };
