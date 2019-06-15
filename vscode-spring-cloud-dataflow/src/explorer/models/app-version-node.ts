import { BaseNode } from "./base-node";
import { TreeItemCollapsibleState } from "vscode";
import { treeUtils } from "../../utils/tree-utils";

export class AppVersionNode extends BaseNode {

    constructor(label: string) {
        super(label);
    }

    protected getTreeItemCollapsibleState(): TreeItemCollapsibleState {
        return TreeItemCollapsibleState.None;
    }

    protected getThemedIconPath(): treeUtils.ThemedIconPath {
        return treeUtils.getThemedIconPath('tag');
    }
}
