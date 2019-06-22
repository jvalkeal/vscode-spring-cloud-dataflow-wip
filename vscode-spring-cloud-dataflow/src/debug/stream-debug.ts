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
import {
    DebugConfigurationProvider, DebugConfiguration, CancellationToken, WorkspaceFolder, ProviderResult, debug
} from "vscode";

export class StreamDebugConfigurationProvider implements DebugConfigurationProvider {

    constructor() {
    }

    provideDebugConfigurations(folder: WorkspaceFolder | undefined, token?: CancellationToken): ProviderResult<DebugConfiguration[]> {
        console.log('debug config', folder);
        const configs: DebugConfiguration[] = [];
        const config: DebugConfiguration = {
            type: 'java',
            name: 'Debug (Attach) - Time Source',
            request: 'attach',
            hostName: "localhost",
            port: 8888,
            projectName: "time-source-rabbit"
        };
        configs.push(config);
        return configs;
    }

    resolveDebugConfiguration(
        folder: WorkspaceFolder | undefined,
        debugConfiguration: DebugConfiguration,
        token?: CancellationToken): ProviderResult<DebugConfiguration> {
            console.log('debug resolve');
            return null;
    }

}

export function streamDebugAttach(): void {

    const config1: DebugConfiguration = {
        type: 'java',
        name: 'Debug (Attach) - Time Source',
        request: 'attach',
        hostName: "localhost",
        port: 8888,
        projectName: "time-source-rabbit"
    };

    const config2: DebugConfiguration = {
        type: 'java',
        name: 'Debug (Attach) - Log Sink',
        request: 'attach',
        hostName: "localhost",
        port: 8889,
        projectName: "time-source-rabbit"
    };

    debug.startDebugging(undefined, config1);
    debug.startDebugging(undefined, config2);

}
