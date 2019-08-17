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
import { COMMAND_SCDF_STREAMS_UNDEPLOY, LSP_SCDF_UNDEPLOY_STREAM } from '../extension-globals';
import { extensionGlobals } from '../extension-variables';
import { DataflowStreamCreateParams } from './stream-commands';

@injectable()
export class StreamsUndeployCommand implements Command {

    constructor(
    ) {}

    get id() {
        return COMMAND_SCDF_STREAMS_UNDEPLOY;
    }

    execute(...args: any[]) {
        const params: DataflowStreamCreateParams = {
            name: args[0],
            definition: args[1]
        };
        extensionGlobals.languageClient.sendNotification(LSP_SCDF_UNDEPLOY_STREAM, params);
    }
}
