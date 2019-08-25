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
import { inject, injectable } from 'inversify';
import * as Path from 'path';
import { ExtensionContext, commands } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, NotificationType } from 'vscode-languageclient';
import { TYPES } from '@pivotal-tools/vscode-extension-di';
import { LanguageSupport } from './core/language-support';
import {
    LANGUAGE_SERVER_JAR, LANGUAGE_SCDF_STREAM_PREFIX, LANGUAGE_SCDF_APP_PREFIX, CONFIG_PREFIX, LANGUAGE_SCDF_DESC,
    COMMAND_SCDF_SERVER_NOTIFY
} from '../extension-globals';
import { extensionGlobals } from '../extension-variables';

@injectable()
export class ScdfLanguageSupport implements LanguageSupport {

    private destroyedStreamNotification = new NotificationType<void,void>("scdf/destroyedStream");
    private createdStreamNotification = new NotificationType<void,void>("scdf/createdStream");
    private deployedStreamNotification = new NotificationType<void,void>("scdf/deployedStream");
    private undeployedStreamNotification = new NotificationType<void,void>("scdf/undeployedStream");

    constructor(
        @inject(TYPES.ExtensionContext)private context: ExtensionContext
    ) {}

    public getLanguageIds(): string[] {
        return [
            LANGUAGE_SCDF_STREAM_PREFIX,
            LANGUAGE_SCDF_APP_PREFIX
        ];
    }

    public buildLanguageClient(): LanguageClient {
        const languageClient= new LanguageClient(CONFIG_PREFIX, LANGUAGE_SCDF_DESC, this.getServerOptions(), this.getLanguageClientOptions());
        languageClient.onReady().then(() => {
            languageClient.onNotification(this.destroyedStreamNotification, () => {
                extensionGlobals.appsExplorerProvider.refresh();
                extensionGlobals.streamsExplorerProvider.refresh();
            });
            languageClient.onNotification(this.createdStreamNotification, () => {
                extensionGlobals.appsExplorerProvider.refresh();
                extensionGlobals.streamsExplorerProvider.refresh();
            });
            languageClient.onNotification(this.deployedStreamNotification, () => {
                extensionGlobals.appsExplorerProvider.refresh();
                extensionGlobals.streamsExplorerProvider.refresh();
            });
            languageClient.onNotification(this.undeployedStreamNotification, () => {
                extensionGlobals.appsExplorerProvider.refresh();
                extensionGlobals.streamsExplorerProvider.refresh();
            });
            commands.executeCommand(COMMAND_SCDF_SERVER_NOTIFY);
        });

        return languageClient;
    }

    public getServerOptions(): ServerOptions {
        const jarPath = Path.resolve(Path.resolve(this.context.extensionPath), 'out', LANGUAGE_SERVER_JAR);
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
        return serverOptions;
    }

    public getLanguageClientOptions(): LanguageClientOptions {
        const clientOptions: LanguageClientOptions = {
            documentSelector: [
                LANGUAGE_SCDF_STREAM_PREFIX,
                LANGUAGE_SCDF_APP_PREFIX
            ]
        };
        return clientOptions;
    }
}
