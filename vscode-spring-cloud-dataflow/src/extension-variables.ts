import { ExtensionContext } from "vscode";
import { IKeytar } from "./utils/keytar";

export namespace extensionGlobals {
    export let context: ExtensionContext;
    export let keytar: IKeytar | undefined;
}
