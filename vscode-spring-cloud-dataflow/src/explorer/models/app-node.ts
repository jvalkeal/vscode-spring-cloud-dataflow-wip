import { BaseNode } from "./base-node";
import { treeUtils } from "../../utils/tree-utils";
import { AppType } from "./app-type-node";

/**
 * Generic node which is any of {@link AppType}.
 */
export class AppNode extends BaseNode {

    constructor(label: string, private readonly type: AppType) {
        super(label);
    }

    protected getThemedIconPath(): treeUtils.ThemedIconPath {
        switch (this.type) {
            case AppType.App:
                return treeUtils.getThemedIconPath('app');
            case AppType.Source:
                return treeUtils.getThemedIconPath('source');
            case AppType.Processor:
                return treeUtils.getThemedIconPath('processor');
            case AppType.Sink:
                return treeUtils.getThemedIconPath('sink');
            case AppType.Task:
                return treeUtils.getThemedIconPath('task');
            default:
                return super.getThemedIconPath();
        }
    }
}
