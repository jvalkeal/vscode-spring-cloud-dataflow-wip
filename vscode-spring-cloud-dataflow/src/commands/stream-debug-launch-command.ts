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
import { COMMAND_SCDF_STREAM_DEBUG_LAUNCH } from '../extension-globals';
import { ServerRegistrationManager } from '../service/server-registration-manager';
import { TYPES } from '../types';

@injectable()
export class StreamDebugLaunchCommand implements Command {

    constructor(
        @inject(TYPES.ServerRegistrationManager)private serverRegistrationManager: ServerRegistrationManager
    ) {}

    get id() {
        return COMMAND_SCDF_STREAM_DEBUG_LAUNCH;
    }

    async execute(...args: any[]) {
        const defaultServer = await this.serverRegistrationManager.getDefaultServer();
        // const x1: Promise<ServerRegistration> = new Promise(async (resolve, reject) => {
        //     const registration = await getDefaultServer();
        //     if (registration) {
        //         resolve(registration);
        //     } else {
        //         reject();
        //     }
        // });

        // const x2 = x1.then(value => {
        //     const model = new ScdfModel(value);
        //     return model.getStreamDeployment(name);
        // });

        // x2.then(entry => {
        //     console.log('xxx', entry);
        // });



        // const params: DataflowStreamCreateParams = {
        //     name: name,
        //     definition: definition,
        //     properties: {
        //         "deployer.time.local.debugPort": "8888",
        //         "deployer.time.local.debugSuspend": "n",
        //         "deployer.log.local.debugPort": "8889",
        //         "deployer.log.local.debugSuspend": "n"
        //     }
        // };
        // extensionGlobals.languageClient.sendNotification(LSP_SCDF_DEPLOY_STREAM, params);
    }
}
