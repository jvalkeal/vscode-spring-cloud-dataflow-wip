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
import { LanguageServerManager, NotificationManager } from '@pivotal-tools/vscode-extension-core';
import { Command, TYPES as DITYPES } from '@pivotal-tools/vscode-extension-di';
import { COMMAND_SCDF_STREAMS_DEPLOY, LSP_SCDF_DEPLOY_STREAM } from '../extension-globals';
import { DataflowStreamCreateParams } from './stream-commands';
import { TYPES } from '../types';

@injectable()
export class StreamsDeployCommand implements Command {

    constructor(
        @inject(TYPES.LanguageServerManager)private languageServerManager: LanguageServerManager,
        @inject(DITYPES.NotificationManager) private notificationManager: NotificationManager
    ) {}

    get id() {
        return COMMAND_SCDF_STREAMS_DEPLOY;
    }

    execute(...args: any[]) {
        const params: DataflowStreamCreateParams = {
            name: args[0],
            definition: args[1]
        };
        this.languageServerManager.getLanguageClient('scdfs').sendNotification(LSP_SCDF_DEPLOY_STREAM, params);
        this.notificationManager.showMessage('Stream deploy sent');
    }
}
