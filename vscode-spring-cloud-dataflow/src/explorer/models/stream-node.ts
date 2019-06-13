import { BaseNode } from "./base-node";
import { Uri } from "vscode";
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
}
