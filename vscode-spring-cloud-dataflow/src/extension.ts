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
import { ExtensionContext, commands, window, workspace, StatusBarItem, StatusBarAlignment } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, NotificationType } from 'vscode-languageclient';
import * as Path from 'path';
import { extensionGlobals } from './extension-variables';
import { Keytar } from './utils/keytar';
import {
    connectServer, disconnectServer, notifyServers, setDefaultServer, getDefaultServer, chooseDefaultServer
} from './commands/server-registrations';
import { AppsExplorerProvider } from './explorer/apps-explorer-provider';
import { StreamsExplorerProvider } from './explorer/streams-explorer-provider';
import {
    LANGUAGE_SCDF_STREAM_PREFIX, LANGUAGE_SCDF_APP_PREFIX, CONFIG_PREFIX, LANGUAGE_SERVER_JAR,
    LANGUAGE_SCDF_DESC, COMMAND_SCDF_SERVER_REGISTER, COMMAND_SCDF_SERVER_UNREGISTER,
    COMMAND_SCDF_EXPLORER_REFRESH, COMMAND_SCDF_STREAMS_SHOW, COMMAND_SCDF_SERVER_NOTIFY,
    COMMAND_SCDF_STREAMS_CREATE, COMMAND_SCDF_STREAMS_DESTROY, COMMAND_SCDF_APPS_REGISTER,
    COMMAND_SCDF_APPS_UNREGISTER, COMMAND_SCDF_SERVER_DEFAULT, COMMAND_SCDF_SERVER_CHOOSE,
    COMMAND_SCDF_STREAMS_DEPLOY, COMMAND_SCDF_STREAMS_UNDEPLOY
} from './extension-globals';
import { ScdfModel } from './service/scdf-model';
import { registerStreamCommands } from './commands/stream-commands';

let languageClient: LanguageClient;

export function activate(context: ExtensionContext) {
    // stash needed global variables to get used in this extension in its lifecycle.
    // global state is not nice but makes life easier in an extention.
    initializeExtensionGlobals(context);

    // register needed commands expected to get handled
    registerCommands(context);

    // register explorer views
    registerExplorer(context);

    // register status bar
    registerStatusBar(context);

    // register language support
    registerLanguageSupport(context);

    // register stream commands
    registerStreamCommands(context);
}

export function deactivate() {
    if (languageClient) {
        languageClient.stop();
    }
}

function initializeExtensionGlobals(context: ExtensionContext) {
    extensionGlobals.keytar = Keytar.tryCreate();
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

function registerCommands(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_REGISTER, () => connectServer()));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_UNREGISTER, disconnectServer));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_DEFAULT, setDefaultServer));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_CHOOSE, chooseDefaultServer));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_NOTIFY, notifyServers));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_APPS_REGISTER, (type, name, appUri, metadataUri) => {
        getDefaultServer().then((s) => {
            if (s) {
                return new ScdfModel(s);
            }
        })
        .then(x => {
            if (x) {
                return x.registerApp(type, name, appUri, metadataUri);
            }
        })
        .then(() => {
            extensionGlobals.appsExplorerProvider.refresh();
            extensionGlobals.streamsExplorerProvider.refresh();
        })
        ;


    }));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_APPS_UNREGISTER, (type, name) => {
        getDefaultServer().then((s) => {
            if (s) {
                return new ScdfModel(s);
            }
        })
        .then(x => {
            if (x) {
                return x.unregisterApp(type, name);
            }
        })
        .then(() => {
            extensionGlobals.appsExplorerProvider.refresh();
            extensionGlobals.streamsExplorerProvider.refresh();
        })
        ;
    }));

}

function registerExplorer(context: ExtensionContext) {
    const appsExplorerProvider = new AppsExplorerProvider();
    window.createTreeView('scdfApps', { treeDataProvider: appsExplorerProvider });

    const streamsExplorerProvider = new StreamsExplorerProvider();
    window.createTreeView('scdfStreams', { treeDataProvider: streamsExplorerProvider });
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_EXPLORER_REFRESH, () => {
        appsExplorerProvider.refresh();
        streamsExplorerProvider.refresh();
    }));
    extensionGlobals.appsExplorerProvider = appsExplorerProvider;
    extensionGlobals.streamsExplorerProvider = streamsExplorerProvider;
}

function registerLanguageSupport(context: ExtensionContext) {
    // we expect server to be plased in 'out' directory, which is a case when real extension
    // is built and when extension if run within vscode assuming `npm run build` is run which
    // copies existing scdf language server either from local maven or remote maven repo.
    const jarPath = Path.resolve(Path.resolve(context.extensionPath), 'out', LANGUAGE_SERVER_JAR);

    context.subscriptions.push(workspace.registerTextDocumentContentProvider('scdfs', extensionGlobals.streamsExplorerProvider));
    commands.registerCommand(COMMAND_SCDF_STREAMS_SHOW, resource => {
        window.showTextDocument(resource.getResourceUri());
    });

    const serverOptions: ServerOptions = {
        run: {
            command: "java",
            args: ["-jar", jarPath]
        },
        debug: {
            command: "java",
            args: ["-jar", jarPath]
        }
    };
    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            LANGUAGE_SCDF_STREAM_PREFIX,
            LANGUAGE_SCDF_APP_PREFIX
        ]
    };

    const destroyedStreamNotification = new NotificationType<void,void>("scdf/destroyedStream");
    const createdStreamNotification = new NotificationType<void,void>("scdf/createdStream");
    const deployedStreamNotification = new NotificationType<void,void>("scdf/deployedStream");
    const undeployedStreamNotification = new NotificationType<void,void>("scdf/undeployedStream");

    languageClient = new LanguageClient(CONFIG_PREFIX, LANGUAGE_SCDF_DESC, serverOptions, clientOptions);
    extensionGlobals.languageClient = languageClient;
    const disposable = languageClient.start();
    languageClient.onReady().then(() => {
        languageClient.onNotification(destroyedStreamNotification, () => {
            extensionGlobals.appsExplorerProvider.refresh();
            extensionGlobals.streamsExplorerProvider.refresh();
        });
        languageClient.onNotification(createdStreamNotification, () => {
            extensionGlobals.appsExplorerProvider.refresh();
            extensionGlobals.streamsExplorerProvider.refresh();
        });
        languageClient.onNotification(deployedStreamNotification, () => {
            extensionGlobals.appsExplorerProvider.refresh();
            extensionGlobals.streamsExplorerProvider.refresh();
        });
        languageClient.onNotification(undeployedStreamNotification, () => {
            extensionGlobals.appsExplorerProvider.refresh();
            extensionGlobals.streamsExplorerProvider.refresh();
        });
        notifyServers();
    });
    context.subscriptions.push(disposable);
}
