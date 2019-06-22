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
import { BaseNode } from "./base-node";
import { Uri, TreeItemCollapsibleState } from "vscode";
import { treeUtils } from "../../utils/tree-utils";

export class StreamNode extends BaseNode {

    constructor(label: string, private readonly serverId: string) {
        super(label, 'definedStream');
    }

    public getResourceUri(): Uri {
        // so that provideTextDocumentContent in StreamsExplorerProvider can
        // use correct server to request stream dsl by using serverId as
        // authority from a path
        return Uri.parse(`scdfs://${this.serverId}/streams/${this.label}.scdfs`);
    }

    protected getThemedIconPath(): treeUtils.ThemedIconPath {
        return treeUtils.getThemedIconPath('stream');
    }

    protected getTreeItemCollapsibleState(): TreeItemCollapsibleState {
        return TreeItemCollapsibleState.None;
    }
}
