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
