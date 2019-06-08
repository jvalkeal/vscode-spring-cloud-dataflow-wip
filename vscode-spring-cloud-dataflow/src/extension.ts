import { ExtensionContext, commands, window, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';
import * as Path from 'path';
import { extensionGlobals } from './extension-variables';
import { Keytar } from './utils/keytar';
import { connectServer, disconnectServer } from './server-registrations';
import { AppsExplorerProvider } from './explorer/apps-explorer-provider';
import { StreamsExplorerProvider } from './explorer/streams-explorer-provider';

let languageClient: LanguageClient;
const jar = 'spring-cloud-dataflow-language-server.jar';

export function activate(context: ExtensionContext) {

    initializeExtensionGlobals(context);

    const jarPath = Path.resolve(Path.resolve(context.extensionPath), 'out', jar);
    // let disposable = commands.registerCommand('scdf.test', () => {
    // 	const params = {
    // 		host: 'localhost'
    // 	};
    // 	languageClient.sendNotification('scdf/environment', params);
    // });
    // context.subscriptions.push(disposable);

    context.subscriptions.push(commands.registerCommand('vscode-spring-cloud-dataflow.server.register', () => connectServer()));
    context.subscriptions.push(commands.registerCommand('vscode-spring-cloud-dataflow.server.unregister', disconnectServer));

    const appsExplorerProvider = new AppsExplorerProvider();
    window.createTreeView('scdfApps', { treeDataProvider: appsExplorerProvider });

    const streamsExplorerProvider = new StreamsExplorerProvider();
    window.createTreeView('scdfStreams', { treeDataProvider: streamsExplorerProvider });
    context.subscriptions.push(commands.registerCommand('vscode-spring-cloud-dataflow.explorer.refresh', () => {
        appsExplorerProvider.refresh();
        streamsExplorerProvider.refresh();
    }));

    // for scdfs language
    context.subscriptions.push(workspace.registerTextDocumentContentProvider('scdfs', streamsExplorerProvider));
    commands.registerCommand('vscode-spring-cloud-dataflow.streams.show', resource => {
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
        documentSelector: ["scdfs", "scdft"]
    };

    languageClient = new LanguageClient('scdf', 'Language Support for Spring Cloud Data Flow', serverOptions, clientOptions);
    languageClient.start();
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
