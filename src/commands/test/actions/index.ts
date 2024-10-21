import { vclusterCreate } from "./vcluster/create"
import { vclusterDelete } from "./vcluster/delete"
import { vclusterList } from "./vcluster/list"
import { vclusterWait } from "./vcluster/wait"

const TEST_ACTIONS = {
    "vcluster/create": vclusterCreate,
    "vcluster/delete": vclusterDelete,
    "vcluster/list": vclusterList,
    "vcluster/wait": vclusterWait,
}

export {
    TEST_ACTIONS
}
