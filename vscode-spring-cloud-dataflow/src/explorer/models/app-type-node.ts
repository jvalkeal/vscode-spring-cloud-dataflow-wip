import { BaseNode } from "./base-node";
import { ScdfModel, ScdfAppEntry } from "../../service/scdf-model";
import { AppNode } from "./app-node";
import { ServerRegistration } from "../../commands/server-registrations";

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
                    appNodes.push(new AppNode(k, type, versions));
                });
                return appNodes;
            });
    }
}
