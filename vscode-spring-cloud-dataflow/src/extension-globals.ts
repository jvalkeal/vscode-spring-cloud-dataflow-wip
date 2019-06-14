// All extension constants goes into this file,
// some which needs to be equals what's defined in package.json

export const EXTENSION_ID: string = 'vscode-spring-cloud-dataflow';
export const CONFIG_PREFIX: string = 'scdf';
export const LANGUAGE_SCDF_STREAM_PREFIX: string = 'scdfs';
export const LANGUAGE_SCDF_TASK_PREFIX: string = 'scdft';
export const LANGUAGE_SERVER_JAR: string = 'spring-cloud-dataflow-language-server.jar';
export const LANGUAGE_SCDF_DESC: string = 'Language Support for Spring Cloud Data Flow';
export const COMMAND_SCDF_SERVER_REGISTER: string = 'vscode-spring-cloud-dataflow.server.register';
export const COMMAND_SCDF_SERVER_UNREGISTER: string = 'vscode-spring-cloud-dataflow.server.unregister';
export const COMMAND_SCDF_SERVER_NOTIFY: string = 'vscode-spring-cloud-dataflow.server.notify';
export const COMMAND_SCDF_EXPLORER_REFRESH: string = 'vscode-spring-cloud-dataflow.explorer.refresh';
export const COMMAND_SCDF_STREAMS_SHOW: string = 'vscode-spring-cloud-dataflow.streams.show';

// native os dependant keytar id's
export namespace keytarConstants {
    export const serviceId: string = EXTENSION_ID;
    export const usernameKey: string = CONFIG_PREFIX + '.username';
    export const passwordKey: string = CONFIG_PREFIX + '.password';
}
