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
// All extension constants goes into this file,
// some which needs to be equals what's defined in package.json

export const EXTENSION_ID: string = 'vscode-spring-cloud-dataflow';
export const CONFIG_PREFIX: string = 'scdf';
export const CONFIG_SCDF_NOTIFICATION_LOCATION: string = CONFIG_PREFIX + '.notification.location';
export const LANGUAGE_SCDF_STREAM_PREFIX: string = 'scdfs';
export const LANGUAGE_SCDF_TASK_PREFIX: string = 'scdft';
export const LANGUAGE_SCDF_APP_PREFIX: string = 'scdfa';
export const LANGUAGE_SERVER_JAR: string = 'spring-cloud-dataflow-language-server.jar';
export const LANGUAGE_SCDF_DESC: string = 'Language Support for Spring Cloud Data Flow';
export const COMMAND_SCDF_SERVER_REGISTER: string = 'vscode-spring-cloud-dataflow.server.register';
export const COMMAND_SCDF_SERVER_UNREGISTER: string = 'vscode-spring-cloud-dataflow.server.unregister';
export const COMMAND_SCDF_SERVER_NOTIFY: string = 'vscode-spring-cloud-dataflow.server.notify';
export const COMMAND_SCDF_SERVER_DEFAULT: string = 'vscode-spring-cloud-dataflow.server.default';
export const COMMAND_SCDF_SERVER_CHOOSE: string = 'vscode-spring-cloud-dataflow.server.choose';
export const COMMAND_SCDF_EXPLORER_REFRESH: string = 'vscode-spring-cloud-dataflow.explorer.refresh';
export const COMMAND_SCDF_STREAMS_SHOW: string = 'vscode-spring-cloud-dataflow.streams.show';
export const COMMAND_SCDF_STREAMS_LOG: string = 'vscode-spring-cloud-dataflow.streams.log';
export const COMMAND_SCDF_STREAMS_LOG_CLOSEALL: string = 'vscode-spring-cloud-dataflow.streams.log.closeall';
export const COMMAND_SCDF_STREAMS_CREATE: string = 'vscode-spring-cloud-dataflow.streams.create';
export const COMMAND_SCDF_STREAMS_DEPLOY: string = 'vscode-spring-cloud-dataflow.streams.deploy';
export const COMMAND_SCDF_STREAMS_UNDEPLOY: string = 'vscode-spring-cloud-dataflow.streams.undeploy';
export const COMMAND_SCDF_STREAMS_DESTROY: string = 'vscode-spring-cloud-dataflow.streams.destroy';
export const COMMAND_SCDF_STREAMS_APP_LOG: string = 'vscode-spring-cloud-dataflow.streams.app.log';
export const COMMAND_SCDF_STREAM_DEBUG_ATTACH: string = 'vscode-spring-cloud-dataflow.streams.debugattach';
export const COMMAND_SCDF_STREAM_DEBUG_LAUNCH: string = 'vscode-spring-cloud-dataflow.streams.debuglaunch';
export const COMMAND_SCDF_TASKS_LOG: string = 'vscode-spring-cloud-dataflow.tasks.log';
export const COMMAND_SCDF_TASKS_CREATE: string = 'vscode-spring-cloud-dataflow.tasks.create';
export const COMMAND_SCDF_TASKS_LAUNCH: string = 'vscode-spring-cloud-dataflow.tasks.launch';
export const COMMAND_SCDF_TASKS_DESTROY: string = 'vscode-spring-cloud-dataflow.tasks.destroy';
export const COMMAND_SCDF_TASKS_DEBUG_ATTACH: string = 'vscode-spring-cloud-dataflow.tasks.debugattach';
export const COMMAND_SCDF_APPS_REGISTER: string = 'vscode-spring-cloud-dataflow.apps.register';
export const COMMAND_SCDF_APPS_UNREGISTER: string = 'vscode-spring-cloud-dataflow.apps.unregister';
export const LSP_SCDF_CREATE_STREAM: string = CONFIG_PREFIX + '/createStream';
export const LSP_SCDF_DEPLOY_STREAM: string = CONFIG_PREFIX + '/deployStream';
export const LSP_SCDF_UNDEPLOY_STREAM: string = CONFIG_PREFIX + '/undeployStream';
export const LSP_SCDF_DESTROY_STREAM: string = CONFIG_PREFIX + '/destroyStream';
export const LSP_SCDF_CREATED_STREAM: string = CONFIG_PREFIX + '/createdStream';
export const LSP_SCDF_DEPLOYED_STREAM: string = CONFIG_PREFIX + '/deployedStream';
export const LSP_SCDF_UNDEPLOYED_STREAM: string = CONFIG_PREFIX + '/undeployedStream';
export const LSP_SCDF_DESTROYED_STREAM: string = CONFIG_PREFIX + '/destroyedStream';
export const LSP_SCDF_CREATE_TASK: string = CONFIG_PREFIX + '/createTask';
export const LSP_SCDF_LAUNCH_TASK: string = CONFIG_PREFIX + '/launchTask';
export const LSP_SCDF_DESTROY_TASK: string = CONFIG_PREFIX + '/destroyTask';
export const LSP_SCDF_CREATED_TASK: string = CONFIG_PREFIX + '/createdTask';
export const LSP_SCDF_LAUNCHED_TASK: string = CONFIG_PREFIX + '/launchedTask';
export const LSP_SCDF_DESTROYED_TASK: string = CONFIG_PREFIX + '/destroyedTask';
