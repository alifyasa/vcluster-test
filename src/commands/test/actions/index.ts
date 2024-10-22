import { shellExecuteScript } from "commands/test/actions/shell/executeScript";
import { vclusterChangeTemplate } from "commands/test/actions/vcluster/vcluster/changeTemplate";
import { vclusterCreate } from "commands/test/actions/vcluster/vcluster/create";
import { vclusterDelete } from "commands/test/actions/vcluster/vcluster/delete";
import { vclusterGet } from "commands/test/actions/vcluster/vcluster/get";
import { vclusterList } from "commands/test/actions/vcluster/vcluster/list";
import { vclusterSaveKubeconfig } from "commands/test/actions/vcluster/vcluster/saveKubeconfig";
import { vclusterWait } from "commands/test/actions/vcluster/vcluster/wait";

const TEST_ACTIONS = {
  "vcluster/vcluster/create": vclusterCreate,
  "vcluster/vcluster/delete": vclusterDelete,
  "vcluster/vcluster/get": vclusterGet,
  "vcluster/vcluster/list": vclusterList,
  "vcluster/vcluster/wait": vclusterWait,
  "vcluster/vcluster/save-kubeconfig": vclusterSaveKubeconfig,
  "vcluster/vcluster/change-template": vclusterChangeTemplate,

  "vcluster/template/create": () => {},
  "vcluster/template/delete": () => {},

  "shell/execute-script": shellExecuteScript,
};

export { TEST_ACTIONS };
