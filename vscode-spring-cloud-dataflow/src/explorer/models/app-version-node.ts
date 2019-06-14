import { BaseNode } from "./base-node";
import { TreeItemCollapsibleState } from "vscode";

export class AppVersionNode extends BaseNode {

    constructor(label: string) {
        super(label);
    }

    protected getTreeItemCollapsibleState(): TreeItemCollapsibleState {
        return TreeItemCollapsibleState.None;
    }
}
