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
import { SettingsManager } from '@pivotal-tools/vscode-extension-core';
import { TYPES } from '@pivotal-tools/vscode-extension-di';
import { extensionGlobals } from '../extension-variables';
import { registerServerInput } from '../commands/register-server';
import { BaseNode } from '../explorer/models/base-node';
import { registerServerChooseInput } from '../commands/choose-server';
import { commands } from 'vscode';
import { resolve } from 'url';

export interface ServerRegistrationNonsensitive {
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

export interface DataflowEnvironmentParams {
    environments: ServerRegistration[];
}

@injectable()
export class ServerRegistrationManager {

    private customRegistriesKey2 = 'scdfDefaultServer';
    private customRegistriesKey = 'scdfServers';


    constructor(
        @inject(TYPES.SettingsManager) private settingsManager: SettingsManager
    ) {}

    public async notifyServers(): Promise<void> {
        const registrations: ServerRegistration[] = [];
        const servers = await this.getServers();
        servers.forEach(registration => registrations.push(registration));
        const params: DataflowEnvironmentParams = {
            environments: registrations
        };
        await extensionGlobals.languageClient.sendNotification('scdf/environment', params);
    }

    public async connectServer(): Promise<void> {
        let servers = await this.getServers();

        const state = await registerServerInput(extensionGlobals.context);

        let newRegistry: ServerRegistration = {
            url: state.address,
            name: state.name,
            credentials: { username: state.username, password: state.password }
        };

        let sensitive: string = JSON.stringify(newRegistry.credentials);
        let key = this.getUsernamePwdKey(newRegistry.name);
        await this.settingsManager.setSensitive(key, sensitive);
        servers.push(newRegistry);
        await this.saveServerRegistrationNonsensitive(servers);
        await this.refresh();
        await this.notifyServers();
    }

    public async disconnectServer(node: BaseNode): Promise<void> {
        let servers = await this.getServers();
        let registry = servers.find(reg => reg.name.toLowerCase() === node.label.toLowerCase());

        if (registry) {
            let key = this.getUsernamePwdKey(node.label);

            await this.settingsManager.deleteSensitive(key);
            servers.splice(servers.indexOf(registry), 1);
            await this.saveServerRegistrationNonsensitive(servers);
            await this.refresh();
        }
    }

    public async setDefaultServer(node: BaseNode): Promise<void> {
        const server = node.label.toLowerCase();
        console.log('set default server', server);
        // TODO: maybe custom type as we get only label from node
        const registration: ServerRegistrationNonsensitive = {url: server, name: server};
        await extensionGlobals.context.globalState.update(this.customRegistriesKey2, registration);
    }

    public async chooseDefaultServer(): Promise<void> {
        const registration = await registerServerChooseInput(extensionGlobals.context);
        console.log('new default registration', registration);
        if (registration) {
            extensionGlobals.statusBarItem.text = '$(database) ' + registration.name;
        }
        await extensionGlobals.context.globalState.update(this.customRegistriesKey2, registration);
    }

    public async getDefaultServer(): Promise<ServerRegistration | undefined | null> {
        let server: ServerRegistration | undefined | null = null;
        const defaultServer = extensionGlobals.context.globalState.get<ServerRegistrationNonsensitive>(this.customRegistriesKey2) || null;
        const servers = await this.getServers();
        if (defaultServer) {
            server = servers.find(registration => registration.url.toLowerCase() === defaultServer.url.toLowerCase());
        }
        if (!server && servers.length === 1) {
            server = servers[0];
        }
        return server;
    }

    public async getDefaultServerx(): Promise<ServerRegistration> {
        const xxx1 = this.settingsManager.getNonsensitivex<ServerRegistrationNonsensitive>(this.customRegistriesKey2);
        const xxx2 = this.getServers();

        return Promise.all([xxx1, xxx2]).then((a) => {
            let server: ServerRegistration | undefined;
            if (a[0]) {
                server = a[1].find(registration => registration.url.toLowerCase() === a[0].url.toLowerCase());
            }
            if (!server && a[1].length === 1) {
                server = a[1][0];
            }
            if (server) {
                return Promise.resolve(server);
            }
            return Promise.reject(new Error());
        });
    }

    private getUsernamePwdKey(registryName: string): string {
        return `usernamepwd_${registryName}`;
    }

    private async refresh(): Promise<void> {
        await commands.executeCommand('vscode-spring-cloud-dataflow.explorer.refresh');
    }

    public async getServers(): Promise<ServerRegistration[]> {
        let servers: ServerRegistration[] = [];
        const nonsensitive = await this.settingsManager.getNonsensitive<ServerRegistrationNonsensitive[]>(this.customRegistriesKey) || [];

        for (let reg of nonsensitive) {
            let key = this.getUsernamePwdKey(reg.name);
            let credentials = await this.settingsManager.getSensitive<ServerRegistrationCredentials>(key);
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

    private async saveServerRegistrationNonsensitive(registries: ServerRegistration[]): Promise<void> {
        const minimal: ServerRegistrationNonsensitive[] = registries
            .map(reg => <ServerRegistrationNonsensitive>{
                url: reg.url,
                name: reg.name });
        await this.settingsManager.setNonsensitive(this.customRegistriesKey, minimal);
    }
}
