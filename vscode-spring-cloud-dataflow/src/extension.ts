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
import { ExtensionContext, window, StatusBarItem, StatusBarAlignment, debug } from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import container from './di.config';
import { TYPES, ExtensionActivateManager } from '@pivotal-tools/vscode-extension-di';
import { extensionGlobals } from './extension-variables';
import { AppsExplorerProvider } from './explorer/apps-explorer-provider';
import { StreamsExplorerProvider } from './explorer/streams-explorer-provider';
import { LANGUAGE_SCDF_STREAM_PREFIX, COMMAND_SCDF_SERVER_CHOOSE } from './extension-globals';
import { StreamDebugConfigurationProvider } from './debug/stream-debug';
import { TYPES as SCDFTYPES } from './types';
import { LanguageServerManager } from './language/core/language-server-manager';

let languageClient: LanguageClient;

export function activate(context: ExtensionContext) {
    container.bind<ExtensionContext>(TYPES.ExtensionContext).toConstantValue(context);
    container.get<ExtensionActivateManager>(TYPES.ExtensionActivateAware).onExtensionActivate(context);

    // stash needed global variables to get used in this extension in its lifecycle.
    // global state is not nice but makes life easier in an extention.
    initializeExtensionGlobals(context);

    // register explorer views
    registerExplorer(context);

    // register status bar
    registerStatusBar(context);

    // register language support
    // for now to get manager created
    const lsm = container.get<LanguageServerManager>(SCDFTYPES.LanguageServerManager);

    registerDebug(context);
}

export function deactivate() {
    if (languageClient) {
        languageClient.stop();
    }
}

function registerDebug(context: ExtensionContext) {
    context.subscriptions.push(debug.registerDebugConfigurationProvider(LANGUAGE_SCDF_STREAM_PREFIX, new StreamDebugConfigurationProvider()));
}

function initializeExtensionGlobals(context: ExtensionContext) {
    extensionGlobals.context = context;
}

interface DataflowStreamCreateParams {
    name: string;
    definition: string;
}

function registerStatusBar(context: ExtensionContext) {
    const statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 0);
    statusBarItem.command = COMMAND_SCDF_SERVER_CHOOSE;
    statusBarItem.show();
    extensionGlobals.statusBarItem = statusBarItem;
}

function registerExplorer(context: ExtensionContext) {
    const appsExplorerProvider = container.get<AppsExplorerProvider>(SCDFTYPES.AppsExplorerProvider);
    window.createTreeView('scdfApps', { treeDataProvider: appsExplorerProvider });

    const streamsExplorerProvider = container.get<StreamsExplorerProvider>(SCDFTYPES.StreamsExplorerProvider);
    window.createTreeView('scdfStreams', { treeDataProvider: streamsExplorerProvider });

    extensionGlobals.appsExplorerProvider = appsExplorerProvider;
    extensionGlobals.streamsExplorerProvider = streamsExplorerProvider;
}
