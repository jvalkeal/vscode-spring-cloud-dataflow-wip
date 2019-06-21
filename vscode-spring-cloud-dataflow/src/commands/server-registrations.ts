import { commands } from "vscode";
import { extensionGlobals } from "../extension-variables";
import { registerServerInput } from "./register-server";
import { registerServerChooseInput } from "./choose-server";
import { BaseNode } from "../explorer/models/base-node";
import { keytarConstants } from "../extension-globals";

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

    if (extensionGlobals.keytar) {
        let sensitive: string = JSON.stringify(newRegistry.credentials);
        let key = getUsernamePwdKey(newRegistry.name);
        await extensionGlobals.keytar.setPassword(keytarConstants.serviceId, key, sensitive);
        servers.push(newRegistry);
        await saveServerRegistrationNonsensitive(servers);
    }
    await refresh();
    await notifyServers();
}

export async function disconnectServer(node: BaseNode): Promise<void> {
    let servers = await getServers();
    let registry = servers.find(reg => reg.name.toLowerCase() === node.label.toLowerCase());

    if (registry) {
        let key = getUsernamePwdKey(node.label);
        if (extensionGlobals.keytar) {
            await extensionGlobals.keytar.deletePassword(keytarConstants.serviceId, key);
        }
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
    let nonsensitive = extensionGlobals.context.globalState.get<ServerRegistrationNonsensitive[]>(customRegistriesKey) || [];
    let servers: ServerRegistration[] = [];

    for (let reg of nonsensitive) {
        try {
            if (extensionGlobals.keytar) {
                let key = getUsernamePwdKey(reg.name);
                let credentialsString = await extensionGlobals.keytar.getPassword(keytarConstants.serviceId, key);
                // let credentials = <ServerRegistrationCredentials>JSON.parse(nonNullValue(credentialsString, 'Invalid stored password'));
                let credentials = <ServerRegistrationCredentials>JSON.parse(credentialsString || '');
                servers.push({
                    url: reg.url,
                    name: reg.name,
                    credentials
                });
            }
        } catch (error) {
            throw new Error(`Unable to retrieve password for container registry ${reg.url}: ${error}`);
        }

    }

    return servers;
}

async function saveServerRegistrationNonsensitive(registries: ServerRegistration[]): Promise<void> {
    const minimal: ServerRegistrationNonsensitive[] = registries
        .map(reg => <ServerRegistrationNonsensitive>{
            url: reg.url,
            name: reg.name });
    await extensionGlobals.context.globalState.update(customRegistriesKey, minimal);
}
