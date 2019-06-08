import { BaseNode } from "./base-node";
import { ScdfModel } from "../../scdf-model";
import { AppNode } from "./app-node";
import { ServerRegistration } from "../../server-registrations";

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

    constructor(label: string, private readonly type: AppType, private readonly registration: ServerRegistration) {
        super(label);
    }

    public async getChildren(element: BaseNode): Promise<BaseNode[]> {
        return this.getAppNodes(this.type);
    }

    private async getAppNodes(type: AppType): Promise<AppNode[]> {
        const scdfModel = new ScdfModel(this.registration.url);
        return scdfModel.getApps()
            .then(apps => apps
                .filter(app => app.type === type.toString())
                .map(app => new AppNode(app.name, type)))
            ;
    }
}
