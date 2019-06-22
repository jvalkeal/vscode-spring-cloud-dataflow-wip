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
