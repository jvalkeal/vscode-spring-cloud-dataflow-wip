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
import { Command } from '@pivotal-tools/vscode-extension-di';
import { COMMAND_SCDF_STREAMS_DESTROY, LSP_SCDF_DESTROY_STREAM } from '../extension-globals';
import { DataflowStreamDestroyParams } from './stream-commands';
import { TYPES } from '../types';
import { ServerRegistrationManager } from '../service/server-registration-manager';

@injectable()
export class StreamsDestroyCommand implements Command {

    constructor(
        @inject(TYPES.ServerRegistrationManager) private serverRegistrationManager: ServerRegistrationManager,
        @inject(TYPES.LanguageServerManager) private languageServerManager: LanguageServerManager
    ) {}

    get id() {
        return COMMAND_SCDF_STREAMS_DESTROY;
    }

    async execute(name: string, environment: string) {
        const server = environment || (await this.serverRegistrationManager.getDefaultServer()).name;
        const params: DataflowStreamDestroyParams = {
            name: name,
            server: server
        };
        this.languageServerManager.getLanguageClient('scdfs').sendNotification(LSP_SCDF_DESTROY_STREAM, params);
    }
}
