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
import { IconManager } from '@pivotal-tools/vscode-extension-core';
import { BaseNode } from './base-node';
import { ScdfModel } from '../../service/scdf-model';
import { StreamNode } from './stream-node';
import { AppTypeNode, AppType } from './app-type-node';
import { ServerRegistration } from '../../service/server-registration-manager';
import { TaskNode } from './task-node';

/**
 * Enumeration of a possible child types under server in a dataflow. Mostly following web
 * UI for things like apps, streams, etc.
 */
export enum ServerMode {
    Apps = 'apps',
    Streams = 'streams',
    Tasks = 'tasks'
}

/**
 * Node representing an dataflow individual server registration in an explorer tree.
 */
export class ServerNode extends BaseNode {

    constructor(
        iconManager: IconManager,
        private readonly registration: ServerRegistration,
        private readonly mode: ServerMode
    ) {
        super(registration.name, undefined, iconManager, 'serverRegistration');
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        switch (this.mode) {
            case ServerMode.Apps:
                return this.getAppTypeNodes();
            case ServerMode.Streams:
                return this.getStreamNodes();
            case ServerMode.Tasks:
                return this.getTaskNodes();
            default:
                return super.getChildren(element);
        }
    }

    private async getAppTypeNodes(): Promise<AppTypeNode[]> {
        let nodes: AppTypeNode[] = [];
        nodes.push(new AppTypeNode('App', this.getIconManager(), AppType.App, this.registration));
        nodes.push(new AppTypeNode('Source', this.getIconManager(), AppType.Source, this.registration));
        nodes.push(new AppTypeNode('Processor', this.getIconManager(), AppType.Processor, this.registration));
        nodes.push(new AppTypeNode('Sink', this.getIconManager(), AppType.Sink, this.registration));
        nodes.push(new AppTypeNode('Task', this.getIconManager(), AppType.Task, this.registration));
        return nodes;
    }

    private async getStreamNodes(): Promise<StreamNode[]> {
        const scdfModel = new ScdfModel(this.registration);
        const serverId = this.registration.url.replace(/[^\w]/g, '');
        return scdfModel.getStreams().then(streams =>
            streams.map(app =>
                new StreamNode(app.name, app.status, app.name, this.getIconManager(), serverId, this.registration)));
    }

    private async getTaskNodes(): Promise<TaskNode[]> {
        const scdfModel = new ScdfModel(this.registration);
        const serverId = this.registration.url.replace(/[^\w]/g, '');
        return scdfModel.getTasks().then(tasks =>
            tasks.map(app =>
                new TaskNode(app.name, app.status, app.name, this.getIconManager(), serverId, this.registration)));
    }
}
