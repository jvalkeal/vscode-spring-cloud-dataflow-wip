import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { treeUtils } from "../../utils/tree-utils";

export abstract class BaseNode {
    public readonly label: string;

    protected constructor(label: string) {
        this.label = label;
    }

    public getTreeItem(): TreeItem {
        let iconPath: treeUtils.ThemedIconPath;
        iconPath = this.getThemedIconPath();
        return {
            label: this.label,
            iconPath: iconPath,
            collapsibleState: TreeItemCollapsibleState.Collapsed
        };
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        return [];
    }

    protected getThemedIconPath(): treeUtils.ThemedIconPath {
        return treeUtils.getThemedIconPath('cloud_done');
    }
}
