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
import { COMMAND_SCDF_SERVER_NOTIFY } from '../extension-globals';
import { ServerRegistrationManager } from '../service/server-registration-manager';
import { TYPES } from '../types';

@injectable()
export class ServerNotifyCommand implements Command {

    constructor(
        @inject(TYPES.ServerRegistrationManager)private serverRegistrationManager: ServerRegistrationManager
    ) {}

    get id() {
        return COMMAND_SCDF_SERVER_NOTIFY;
    }

    async execute() {
        await this.serverRegistrationManager.notifyServers();
    }
}
