import { BaseNode } from "./base-node";
import { treeUtils } from "../../utils/tree-utils";
import { AppType } from "./app-type-node";
import { AppVersionNode } from "./app-version-node";

/**
 * Generic node which is any of {@link AppType}.
 */
export class AppNode extends BaseNode {

    constructor(label: string, private readonly type: AppType, private readonly versions?: string[]) {
        super(label);
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        let nodes: AppVersionNode[] = [];
        if (this.versions) {
            this.versions.forEach(v => {
                nodes.push(new AppVersionNode(v));
            });
        }
        return nodes;
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
