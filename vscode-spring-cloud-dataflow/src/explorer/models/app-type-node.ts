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
import { ScdfModel, ScdfAppEntry } from "../../service/scdf-model";
import { AppNode } from "./app-node";
import { ServerRegistration } from "../../service/server-registration-manager";
import { IconManager } from "../../language/core/icon-manager";

/**
 * Enumeration of a possible app types in a dataflow. These are hardcoded
 * application types used in a dataflow.
 */
export enum AppType {
    App = 'app',
    Source = 'source',
    Processor = 'processor',
    Sink = 'sink',
    Task = 'task'
}

/**
 * Node representing an {@link AppType} type in an explorer tree.
 */
export class AppTypeNode extends BaseNode {

    constructor(label: string, iconManager: IconManager, private readonly type: AppType, private readonly registration: ServerRegistration) {
        super(label, iconManager);
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        return this.getAppNodes(this.type);
    }

    private async getAppNodes(type: AppType): Promise<AppNode[]> {
        const scdfModel = new ScdfModel(this.registration);
        return scdfModel.getApps()
            .then(apps => {
                const grouped = new Map<string, Array<ScdfAppEntry>>();
                apps.forEach(app => {
                    if (app.type === type.toString()) {
                        let group = grouped.get(app.name);
                        if (!group) {
                            group = new Array<ScdfAppEntry>();
                            group.push(app);
                            grouped.set(app.name, group);
                        } else {
                            group.push(app);
                        }
                    }
                });
                const appNodes = new Array<AppNode>();
                grouped.forEach((v, k) => {
                    const versions: string[] = [];
                    v.forEach(app => versions.push(app.version));
                    appNodes.push(new AppNode(k, this.getIconManager(), type, versions));
                });
                return appNodes;
            });
    }
}
