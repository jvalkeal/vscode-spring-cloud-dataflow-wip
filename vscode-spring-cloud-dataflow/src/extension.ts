import { ExtensionContext, commands, window, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';
import * as Path from 'path';
import { extensionGlobals } from './extension-variables';
import { Keytar } from './utils/keytar';
import { connectServer, disconnectServer, notifyServers } from './commands/server-registrations';
import { AppsExplorerProvider } from './explorer/apps-explorer-provider';
import { StreamsExplorerProvider } from './explorer/streams-explorer-provider';
import {
    LANGUAGE_SCDF_STREAM_PREFIX, LANGUAGE_SCDF_TASK_PREFIX, CONFIG_PREFIX, LANGUAGE_SERVER_JAR,
    LANGUAGE_SCDF_DESC, COMMAND_SCDF_SERVER_REGISTER, COMMAND_SCDF_SERVER_UNREGISTER,
    COMMAND_SCDF_EXPLORER_REFRESH, COMMAND_SCDF_STREAMS_SHOW, COMMAND_SCDF_SERVER_NOTIFY
} from './extension-globals';

let languageClient: LanguageClient;

export function activate(context: ExtensionContext) {
    // stash needed global variables to get used in this extension in its lifecycle.
    // global state is not nice but makes life easier in an extention.
    initializeExtensionGlobals(context);

    // register needed commands expected to get handled
    registerCommands(context);

    // register explorer views
    registerExplorer(context);

    // register language support
    registerLanguageSupport(context);
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

function registerCommands(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_REGISTER, () => connectServer()));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_UNREGISTER, disconnectServer));
    context.subscriptions.push(commands.registerCommand(COMMAND_SCDF_SERVER_NOTIFY, notifyServers));
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
            LANGUAGE_SCDF_TASK_PREFIX
        ]
    };

    languageClient = new LanguageClient(CONFIG_PREFIX, LANGUAGE_SCDF_DESC, serverOptions, clientOptions);
    extensionGlobals.languageClient = languageClient;
    const disposable = languageClient.start();
    languageClient.onReady().then(() => notifyServers());
    context.subscriptions.push(disposable);
}
