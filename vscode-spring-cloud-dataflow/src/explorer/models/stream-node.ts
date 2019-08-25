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
import { Uri } from "vscode";
import { ScdfModel } from "../../service/scdf-model";
import { RuntimeNode } from "./runtime-node";
import { ServerRegistration } from "../../service/server-registration-manager";
import { IconManager, ThemedIconPath } from "../../language/core/icon-manager";

export class StreamNode extends BaseNode {

    constructor(label: string, iconManager: IconManager, private readonly serverId: string, private readonly registration: ServerRegistration) {
        super(label, iconManager, 'definedStream');
    }

    public getResourceUri(): Uri {
        // so that provideTextDocumentContent in StreamsExplorerProvider can
        // use correct server to request stream dsl by using serverId as
        // authority from a path
        return Uri.parse(`scdfs://${this.serverId}/streams/${this.label}.scdfs`);
    }

    protected getThemedIconPath(): ThemedIconPath {
        return this.getIconManager().getThemedIconPath('stream');
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        return this.getAppNodes();
    }

    private async getAppNodes(): Promise<RuntimeNode[]> {
        const appNodes: RuntimeNode[] = [];
        const scdfModel = new ScdfModel(this.registration);
        await scdfModel.getStreamRuntime(this.label)
            .then(runtimes => runtimes
                .filter(runtime => runtime.name === this.label)
                .forEach(runtime => {
                    runtime.applications.forEach(application => {
                        appNodes.push(new RuntimeNode(application.name, this.getIconManager(), application.instances));
                    });
                })
            );
        return appNodes;
    }
}
