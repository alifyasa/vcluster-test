import { shellExecute } from "./shell/execute"
import { vclusterCreate } from "./vcluster/create"
import { vclusterDelete } from "./vcluster/delete"
import { vclusterGet } from "./vcluster/get"
import { vclusterList } from "./vcluster/list"
import { vclusterWait } from "./vcluster/wait"

const TEST_ACTIONS = {
    "vcluster/create": vclusterCreate,
    "vcluster/delete": vclusterDelete,
    "vcluster/get": vclusterGet,
    "vcluster/list": vclusterList,
    "vcluster/wait": vclusterWait,
    "shell/execute": shellExecute
}

export {
    TEST_ACTIONS
}
