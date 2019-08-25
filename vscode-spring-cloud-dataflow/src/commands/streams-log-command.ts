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
import { injectable } from 'inversify';
import { Command } from '@pivotal-tools/vscode-extension-di';
import { COMMAND_SCDF_STREAMS_LOG } from '../extension-globals';
import { ServerRegistration } from '../service/server-registration-manager';
import { ScdfModel } from '../service/scdf-model';
import { window } from 'vscode';

@injectable()
export class StreamsLogCommand implements Command {

    constructor(
    ) {}

    get id() {
        return COMMAND_SCDF_STREAMS_LOG;
    }

    async execute(...args: any[]) {
        const server: ServerRegistration = args[0].registration;
        const model = new ScdfModel(server);
        const data = await model.streamLogs(args[0].label);
        Object.keys(data.logs).map(key => {
            const output = window.createOutputChannel('SCDF ' + key);
            output.clear();
            output.append(data.logs[key]);
            output.show();
        });
    }
}