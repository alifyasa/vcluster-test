import { shellExecuteScript } from "./shell/executeScript"
import { vclusterCreate } from "./vcluster/create"
import { vclusterDelete } from "./vcluster/delete"
import { vclusterGet } from "./vcluster/get"
import { vclusterList } from "./vcluster/list"
import { vclusterSaveKubeconfig } from "./vcluster/saveKubeconfig"
import { vclusterWait } from "./vcluster/wait"

const TEST_ACTIONS = {
    "vcluster/create": vclusterCreate,
    "vcluster/delete": vclusterDelete,
    "vcluster/get": vclusterGet,
    "vcluster/list": vclusterList,
    "vcluster/wait": vclusterWait,
    "vcluster/saveKubeconfig": vclusterSaveKubeconfig,
    "shell/executeScript": shellExecuteScript
}

export {
    TEST_ACTIONS
}
