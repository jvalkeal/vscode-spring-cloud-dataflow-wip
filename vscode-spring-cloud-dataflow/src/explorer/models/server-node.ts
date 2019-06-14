import { BaseNode } from "./base-node";
import { AppNode } from "./app-node";
import { ScdfModel } from "../../service/scdf-model";
import { StreamNode } from "./stream-node";
import { ServerRegistration } from "../../commands/server-registrations";
import { AppTypeNode, AppType } from "./app-type-node";

/**
 * Enumeration of a possible child types under server in a dataflow. Mostly following web
 * UI for things like apps, streams, etc.
 */
export enum ServerMode {
    Apps = 'apps',
    Streams = 'streams'
}

/**
 * Node representing an dataflow individual server registration in an explorer tree.
 */
export class ServerNode extends BaseNode {

    constructor(private readonly registration: ServerRegistration, private readonly mode: ServerMode) {
        super(registration.url, 'serverRegistration');
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        switch (this.mode) {
            case ServerMode.Apps:
                return this.getAppTypeNodes();
            case ServerMode.Streams:
                return this.getStreamNodes();
            default:
                return super.getChildren(element);
        }
    }

    private async getAppTypeNodes(): Promise<AppTypeNode[]> {
        let nodes: AppTypeNode[] = [];
        nodes.push(new AppTypeNode('App', AppType.App, this.registration));
        nodes.push(new AppTypeNode('Source', AppType.Source, this.registration));
        nodes.push(new AppTypeNode('Processor', AppType.Processor, this.registration));
        nodes.push(new AppTypeNode('Sink', AppType.Sink, this.registration));
        nodes.push(new AppTypeNode('Task', AppType.Task, this.registration));
        return nodes;
    }

    private async getStreamNodes(): Promise<StreamNode[]> {
        const scdfModel = new ScdfModel(this.registration.url);
        const serverId = this.registration.url.replace(/[^\w]/g, '');
        return scdfModel.getStreams().then(streams => streams.map(app => new StreamNode(app.name, serverId)));
    }
}
