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
import { ExtensionContext, window } from "vscode";
import { ServerRegistration, getServers } from "./server-registrations";

export async function registerServerChooseInput(context: ExtensionContext): Promise<ServerRegistration | undefined> {
    const servers = await getServers();
    const names: string[] = [];
    servers.forEach(server => {
        names.push(server.name);
    });
    const result = await window.showQuickPick(names, {
		placeHolder: ''
    });
    return servers.find(server => server.name === result);
}
