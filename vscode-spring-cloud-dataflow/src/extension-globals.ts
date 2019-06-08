// All extension constants goes into this file,
// some which needs to be equals what's defined in package.json

export const EXTENSION_ID: string = 'vscode-spring-cloud-dataflow';
export const CONFIG_PREFIX: string = 'scdf';

// native os dependant keytar id's
export namespace keytarConstants {
    export const serviceId: string = EXTENSION_ID;
    export const usernameKey: string = CONFIG_PREFIX + '.username';
    export const passwordKey: string = CONFIG_PREFIX + '.password';
}
