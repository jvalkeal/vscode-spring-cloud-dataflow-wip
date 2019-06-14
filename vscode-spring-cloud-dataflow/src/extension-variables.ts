import { ExtensionContext } from "vscode";
import { IKeytar } from "./utils/keytar";
import { AppsExplorerProvider } from "./explorer/apps-explorer-provider";
import { StreamsExplorerProvider } from "./explorer/streams-explorer-provider";

export namespace extensionGlobals {
    export let context: ExtensionContext;
    export let keytar: IKeytar | undefined;
    export let appsExplorerProvider: AppsExplorerProvider;
    export let streamsExplorerProvider: StreamsExplorerProvider;
}
