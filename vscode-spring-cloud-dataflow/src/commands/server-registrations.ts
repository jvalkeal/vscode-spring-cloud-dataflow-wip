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
import { commands } from "vscode";
import { SettingsManager } from "@pivotal-tools/vscode-extension-core";
import { extensionGlobals } from "../extension-variables";
import { registerServerInput } from "./register-server";
import { registerServerChooseInput } from "./choose-server";
import { BaseNode } from "../explorer/models/base-node";
import container from "../di.config";
import { TYPES } from "@pivotal-tools/vscode-extension-di";

interface ServerRegistrationNonsensitive {
    url: string;
    name: string;
}

export interface ServerRegistrationCredentials {
    username: string;
    password: string;
}

export interface ServerRegistration extends ServerRegistrationNonsensitive {
    credentials: ServerRegistrationCredentials;
}

interface DataflowEnvironmentParams {
    environments: ServerRegistration[];
}

export async function notifyServers(): Promise<void> {
    const registrations: ServerRegistration[] = [];
    const servers = await getServers();
    servers.forEach(registration => registrations.push(registration));
    const params: DataflowEnvironmentParams = {
        environments: registrations
    };
   	await extensionGlobals.languageClient.sendNotification('scdf/environment', params);
}

export async function connectServer(): Promise<void> {
    let servers = await getServers();

    const state = await registerServerInput(extensionGlobals.context);

    let newRegistry: ServerRegistration = {
        url: state.address,
        name: state.name,
        credentials: { username: state.username, password: state.password }
    };

    const settingManager: SettingsManager = container.get(TYPES.SettingsManager);
    let sensitive: string = JSON.stringify(newRegistry.credentials);
    let key = getUsernamePwdKey(newRegistry.name);
    await settingManager.setSensitive(key, sensitive);
    servers.push(newRegistry);
    await saveServerRegistrationNonsensitive(servers);
    await refresh();
    await notifyServers();
}

export async function disconnectServer(node: BaseNode): Promise<void> {
    let servers = await getServers();
    let registry = servers.find(reg => reg.name.toLowerCase() === node.label.toLowerCase());

    if (registry) {
        let key = getUsernamePwdKey(node.label);

        const settingManager: SettingsManager = container.get(TYPES.SettingsManager);
        await settingManager.deleteSensitive(key);
        servers.splice(servers.indexOf(registry), 1);
        await saveServerRegistrationNonsensitive(servers);
        await refresh();
    }
}

const customRegistriesKey2 = 'scdfDefaultServer';

export async function setDefaultServer(node: BaseNode): Promise<void> {
    const server = node.label.toLowerCase();
    console.log('set default server', server);
    // TODO: maybe custom type as we get only label from node
    const registration: ServerRegistrationNonsensitive = {url: server, name: server};
    await extensionGlobals.context.globalState.update(customRegistriesKey2, registration);
}

export async function chooseDefaultServer(): Promise<void> {
    const registration = await registerServerChooseInput(extensionGlobals.context);
    console.log('new default registration', registration);
    if (registration) {
        extensionGlobals.statusBarItem.text = '$(database) ' + registration.name;
    }
    await extensionGlobals.context.globalState.update(customRegistriesKey2, registration);
}

export async function getDefaultServer(): Promise<ServerRegistration | undefined | null> {
    let server: ServerRegistration | undefined | null = null;
    const defaultServer = extensionGlobals.context.globalState.get<ServerRegistrationNonsensitive>(customRegistriesKey2) || null;
    const servers = await getServers();
    if (defaultServer) {
        server = servers.find(registration => registration.url.toLowerCase() === defaultServer.url.toLowerCase());
    }
    if (!server && servers.length === 1) {
        server = servers[0];
    }
    return server;
}

const customRegistriesKey = 'scdfServers';

function getUsernamePwdKey(registryName: string): string {
    return `usernamepwd_${registryName}`;
}

async function refresh(): Promise<void> {
    await commands.executeCommand('vscode-spring-cloud-dataflow.explorer.refresh');
}

export async function getServers(): Promise<ServerRegistration[]> {
    const settingManager: SettingsManager = container.get(TYPES.SettingsManager);
    let servers: ServerRegistration[] = [];
    const nonsensitive = await settingManager.getNonsensitive<ServerRegistrationNonsensitive[]>(customRegistriesKey) || [];

    for (let reg of nonsensitive) {
        let key = getUsernamePwdKey(reg.name);
        let credentials = await settingManager.getSensitive<ServerRegistrationCredentials>(key);
        if (credentials) {
            servers.push({
                url: reg.url,
                name: reg.name,
                credentials
            });
        }
    }
    return servers;
}

async function saveServerRegistrationNonsensitive(registries: ServerRegistration[]): Promise<void> {
    const minimal: ServerRegistrationNonsensitive[] = registries
        .map(reg => <ServerRegistrationNonsensitive>{
            url: reg.url,
            name: reg.name });
    const settingManager: SettingsManager = container.get(TYPES.SettingsManager);
    await settingManager.setNonsensitive(customRegistriesKey, minimal);
}
