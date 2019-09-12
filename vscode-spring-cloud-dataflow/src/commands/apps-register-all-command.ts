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
import { injectable, inject } from 'inversify';
import { Command } from '@pivotal-tools/vscode-extension-di';
import { COMMAND_SCDF_APPS_REGISTER } from '../extension-globals';
import { ServerRegistrationManager } from '../service/server-registration-manager';
import { TYPES } from '../types';
import { ScdfModel } from '../service/scdf-model';
import { AppsExplorerProvider } from '../explorer/apps-explorer-provider';
import { StreamsExplorerProvider } from '../explorer/streams-explorer-provider';
import { commands, Uri } from 'vscode';
import { LanguageServerManager } from '@pivotal-tools/vscode-extension-core';
import { TextDocumentIdentifier } from 'vscode-languageclient';

@injectable()
export class AppsRegisterAllCommand implements Command {

    constructor(
        @inject(TYPES.ServerRegistrationManager) private serverRegistrationManager: ServerRegistrationManager,
        @inject(TYPES.AppsExplorerProvider) private appsExplorerProvider: AppsExplorerProvider,
        @inject(TYPES.StreamsExplorerProvider) private streamsExplorerProvider: StreamsExplorerProvider,
        @inject(TYPES.LanguageServerManager) private languageServerManager: LanguageServerManager
    ) {}

    get id() {
        return 'vscode-spring-cloud-dataflow.apps.registerall';
    }

    async execute(...args: any[]) {
        // console.log('DDD1', args[0].document);
        // console.log('DDD2', args[0].document.uri);
        console.log('XXX1', args);
        const args0: Uri = args[0];
        console.log('XXX2', args0);
        const uri: string = args0.toString();
        console.log('XXX3', uri);

        const params: TextDocumentIdentifier = {
            uri: uri
        };
        console.log('XXX4', params);
        this.languageServerManager.getLanguageClient('scdfa').sendNotification('scdf/registerAll', params);
        console.log('XXX5');

        // commands.executeCommand();
        // scdf/registerAll
        // const defaultServer = await this.serverRegistrationManager.getDefaultServer();
        // const model = new ScdfModel(defaultServer);
        // await model.registerApp(args[0], args[1], args[2], args[3]);
        // this.appsExplorerProvider.refresh();
        // this.streamsExplorerProvider.refresh();
    }
}
