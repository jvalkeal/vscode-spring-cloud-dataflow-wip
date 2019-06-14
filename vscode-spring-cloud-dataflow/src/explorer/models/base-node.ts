import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { treeUtils } from "../../utils/tree-utils";

export abstract class BaseNode {
    public readonly label: string;

    protected constructor(label: string, private readonly contextValue?: string) {
        this.label = label;
    }

    public getTreeItem(): TreeItem {
        let iconPath: treeUtils.ThemedIconPath;
        iconPath = this.getThemedIconPath();
        const collapsibleState = this.getTreeItemCollapsibleState();
        return {
            label: this.label,
            iconPath: iconPath,
            collapsibleState: collapsibleState,
            contextValue: this.contextValue
        };
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        return [];
    }

    protected getThemedIconPath(): treeUtils.ThemedIconPath {
        return treeUtils.getThemedIconPath('cloud_done');
    }

    protected getTreeItemCollapsibleState(): TreeItemCollapsibleState {
        return TreeItemCollapsibleState.Collapsed;
    }
}
