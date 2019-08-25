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
import { AppType } from "./app-type-node";
import { AppVersionNode } from "./app-version-node";
import { IconManager, ThemedIconPath } from "../../language/core/icon-manager";

/**
 * Generic node which is any of {@link AppType}.
 */
export class AppNode extends BaseNode {

    constructor(label: string, iconManager: IconManager, private readonly type: AppType, private readonly versions?: string[]) {
        super(label, iconManager, 'definedApp');
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        let nodes: AppVersionNode[] = [];
        if (this.versions) {
            this.versions.forEach(v => {
                nodes.push(new AppVersionNode(v, this.getIconManager(), this.type, this.label, v));
            });
        }
        return nodes;
    }

    protected getThemedIconPath(): ThemedIconPath {
        switch (this.type) {
            case AppType.App:
                return this.getIconManager().getThemedIconPath('app');
            case AppType.Source:
                return this.getIconManager().getThemedIconPath('source');
            case AppType.Processor:
                return this.getIconManager().getThemedIconPath('processor');
            case AppType.Sink:
                return this.getIconManager().getThemedIconPath('sink');
            case AppType.Task:
                return this.getIconManager().getThemedIconPath('task');
            default:
                return super.getThemedIconPath();
        }
    }
}
