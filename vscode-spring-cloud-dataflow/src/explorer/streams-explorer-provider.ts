import { TreeDataProvider, TreeItem, ProviderResult, EventEmitter, TextDocumentContentProvider, Uri, CancellationToken, Event } from "vscode";
import { BaseNode } from "./models/base-node";
import { getServers } from "../commands/server-registrations";
import { ServerNode, ServerMode } from "./models/server-node";
import { ScdfModel } from "../service/scdf-model";

export class StreamsExplorerProvider implements TreeDataProvider<BaseNode>, TextDocumentContentProvider {
	private _onDidChangeTreeData: EventEmitter<BaseNode> = new EventEmitter<BaseNode>();
	onDidChangeTreeData: Event<BaseNode> = this._onDidChangeTreeData.event;
	// TODO: do we need onDidChange from TextDocumentContentProvider
	// onDidChange?: Event<Uri> | undefined;

	getChildren(element?: BaseNode | undefined): ProviderResult<BaseNode[]> {
		if (!element) {
			return this.getServerNodes();
		}
		return element.getChildren(element);
	}

	getTreeItem(element: BaseNode): TreeItem | Thenable<TreeItem> {
		return element.getTreeItem();
	}

	provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
		// TODO: expecting /streams/ so substring(9) is a bit of a hack
		const streamName = uri.path.substring(9).replace('.scdfs', "");
		return getServers()
			.then(servers => servers.find(s => {
				const serverId = s.url.replace(/[^\w]/g, '');
				return serverId === uri.authority;
			}))
			.then(registration => {
				if (registration) {
					const scdfModel = new ScdfModel(registration);
					return scdfModel.getStreamDsl(streamName);
				}
				throw new Error();
			});
	}

	public refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	private async getServerNodes(): Promise<BaseNode[]> {
		return new Promise(async (resolve, reject) => {
			const servers = await getServers();
			const ret: BaseNode[] = [];
			servers.forEach(registration => {
				ret.push(new ServerNode(registration, ServerMode.Streams));
			});
			resolve(ret);
		});
	}
}
