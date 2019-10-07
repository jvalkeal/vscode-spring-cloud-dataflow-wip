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
import { LanguageServerManager } from '@pivotal-tools/vscode-extension-core';
import { Command, DITYPES } from '@pivotal-tools/vscode-extension-di';
import { COMMAND_SCDF_STREAMS_CREATE, LSP_SCDF_CREATE_STREAM } from '../extension-globals';
import { DataflowStreamCreateParams } from './stream-commands';
import { TYPES } from '../types';
import { ServerRegistrationManager } from '../service/server-registration-manager';

@injectable()
export class StreamsCreateCommand implements Command {

    constructor(
        @inject(TYPES.ServerRegistrationManager) private serverRegistrationManager: ServerRegistrationManager,
        @inject(DITYPES.LanguageServerManager) private languageServerManager: LanguageServerManager
    ) {}

    get id() {
        return COMMAND_SCDF_STREAMS_CREATE;
    }

    async execute(name: string, environment: string, description: string, definition: string) {
        const server = environment || (await this.serverRegistrationManager.getDefaultServer()).name;
        const params: DataflowStreamCreateParams = {
            name: name,
            description: description,
            definition: definition,
            server: server
        };
        this.languageServerManager.getLanguageClient('scdfs').sendNotification(LSP_SCDF_CREATE_STREAM, params);
    }
}
