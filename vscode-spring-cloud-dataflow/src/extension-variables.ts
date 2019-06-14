import { ExtensionContext } from "vscode";
import { IKeytar } from "./utils/keytar";
import { AppsExplorerProvider } from "./explorer/apps-explorer-provider";
import { StreamsExplorerProvider } from "./explorer/streams-explorer-provider";
import { LanguageClient } from "vscode-languageclient";

export namespace extensionGlobals {
    export let context: ExtensionContext;
    export let keytar: IKeytar | undefined;
    export let languageClient: LanguageClient;
    export let appsExplorerProvider: AppsExplorerProvider;
    export let streamsExplorerProvider: StreamsExplorerProvider;
}
