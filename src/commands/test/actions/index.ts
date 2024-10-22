import { shellExecuteScript } from "./shell/executeScript";
import { vclusterCreate } from "./vcluster/create";
import { vclusterDelete } from "./vcluster/delete";
import { vclusterGet } from "./vcluster/get";
import { vclusterList } from "./vcluster/list";
import { vclusterSaveKubeconfig } from "./vcluster/saveKubeconfig";
import { vclusterWait } from "./vcluster/wait";

const TEST_ACTIONS = {
  "vcluster/vcluster/create": vclusterCreate,
  "vcluster/vcluster/delete": vclusterDelete,
  "vcluster/vcluster/get": vclusterGet,
  "vcluster/vcluster/list": vclusterList,
  "vcluster/vcluster/wait": vclusterWait,
  "vcluster/vcluster/saveKubeconfig": vclusterSaveKubeconfig,

  "vcluster/template/create": () => {},
  "vcluster/template/delete": () => {},

  "shell/executeScript": shellExecuteScript,
};

export { TEST_ACTIONS };
