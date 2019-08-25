/*
 * Copyright 2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { TreeDataProvider, TreeItem, ProviderResult, EventEmitter, TextDocumentContentProvider, Uri, CancellationToken, Event, window } from "vscode";
import { BaseNode } from "./models/base-node";
import { ServerNode, ServerMode } from "./models/server-node";
import { ScdfModel } from "../service/scdf-model";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ServerRegistrationManager } from "../service/server-registration-manager";
import { IconManager } from "../language/core/icon-manager";

@injectable()
export class StreamsExplorerProvider implements TreeDataProvider<BaseNode>, TextDocumentContentProvider {
	private _onDidChangeTreeData: EventEmitter<BaseNode> = new EventEmitter<BaseNode>();
	onDidChangeTreeData: Event<BaseNode> = this._onDidChangeTreeData.event;
	// TODO: do we need onDidChange from TextDocumentContentProvider
	// onDidChange?: Event<Uri> | undefined;

    constructor(
        @inject(TYPES.ServerRegistrationManager)private serverRegistrationManager: ServerRegistrationManager,
        @inject(TYPES.IconManager)private iconManager: IconManager
    ) {
		window.createTreeView('scdfStreams', { treeDataProvider: this });
	}

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
		return this.serverRegistrationManager.getServers()
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
            const servers = await this.serverRegistrationManager.getServers();
			const ret: BaseNode[] = [];
			servers.forEach(registration => {
				ret.push(new ServerNode(this.iconManager, registration, ServerMode.Streams));
			});
			resolve(ret);
		});
	}
}
