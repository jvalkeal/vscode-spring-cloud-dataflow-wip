import { TreeDataProvider, TreeItem, ProviderResult, EventEmitter } from "vscode";
import { BaseNode } from "./models/base-node";
import { getServers, ServerRegistration } from "../server-registrations";
import { Event } from "vscode-jsonrpc";
import { ServerNode, ServerMode } from "./models/server-node";

export class AppsExplorerProvider implements TreeDataProvider<BaseNode> {
    private _onDidChangeTreeData: EventEmitter<BaseNode> = new EventEmitter<BaseNode>();
    onDidChangeTreeData: Event<BaseNode> = this._onDidChangeTreeData.event;

    getChildren(element?: BaseNode | undefined): ProviderResult<BaseNode[]> {
        if (!element) {
            return this.getServerNodes();
        }
        return element.getChildren(element);
    }

    getTreeItem(element: BaseNode): TreeItem | Thenable<TreeItem> {
        return element.getTreeItem();
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private async getServerNodes(): Promise<BaseNode[]> {
        return new Promise(async (resolve, reject) => {
            const servers = await getServers();
            const ret: BaseNode[] = [];
            servers.forEach(registration => {
                ret.push(new ServerNode(registration, ServerMode.Apps));
            });
            resolve(ret);
        });
    }
}
