import { ExtensionContext, commands } from "vscode";
import {
    COMMAND_SCDF_STREAMS_CREATE, LSP_SCDF_CREATE_STREAM, LSP_SCDF_DEPLOY_STREAM, LSP_SCDF_UNDEPLOY_STREAM,
    LSP_SCDF_DESTROY_STREAM, COMMAND_SCDF_STREAMS_DEPLOY, COMMAND_SCDF_STREAMS_UNDEPLOY, COMMAND_SCDF_STREAMS_DESTROY
} from "../extension-globals";
import { extensionGlobals } from "../extension-variables";

interface DataflowStreamCreateParams {
    name: string;
    definition: string;
}

export function registerStreamCommands(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_STREAMS_CREATE, (name, definition) => {
        const params: DataflowStreamCreateParams = {
            name: name,
            definition: definition
        };
        extensionGlobals.languageClient.sendNotification(LSP_SCDF_CREATE_STREAM, params);
    }));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_STREAMS_DEPLOY, (name, definition) => {
        const params: DataflowStreamCreateParams = {
            name: name,
            definition: definition
        };
        extensionGlobals.languageClient.sendNotification(LSP_SCDF_DEPLOY_STREAM, params);
    }));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_STREAMS_UNDEPLOY, (name, definition) => {
        const params: DataflowStreamCreateParams = {
            name: name,
            definition: definition
        };
        extensionGlobals.languageClient.sendNotification(LSP_SCDF_UNDEPLOY_STREAM, params);
    }));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_STREAMS_DESTROY, (name, definition) => {
        const params: DataflowStreamCreateParams = {
            name: name,
            definition: definition
        };
        extensionGlobals.languageClient.sendNotification(LSP_SCDF_DESTROY_STREAM, params);
    }));
}
