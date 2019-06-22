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
import { ExtensionContext, commands } from "vscode";
import {
    COMMAND_SCDF_STREAMS_CREATE, LSP_SCDF_CREATE_STREAM, LSP_SCDF_DEPLOY_STREAM, LSP_SCDF_UNDEPLOY_STREAM,
    LSP_SCDF_DESTROY_STREAM, COMMAND_SCDF_STREAMS_DEPLOY, COMMAND_SCDF_STREAMS_UNDEPLOY, COMMAND_SCDF_STREAMS_DESTROY,
    COMMAND_SCDF_STREAM_DEBUG_ATTACH
} from "../extension-globals";
import { extensionGlobals } from "../extension-variables";
import { streamDebugAttach } from "../debug/stream-debug";

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
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_STREAM_DEBUG_ATTACH, (name, definition) => {
        streamDebugAttach();
    }));
}
