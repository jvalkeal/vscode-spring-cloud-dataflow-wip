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
import { ContainerModule } from 'inversify';
import { Command, TYPES as DITYPES } from '@pivotal-tools/vscode-extension-di';
import { TYPES } from '../types';
import { StreamsCreateCommand } from './streams-create-command';
import { StreamsDeployCommand } from './streams-deploy-command';
import { StreamsUndeployCommand } from './streams-undeploy-command';
import { StreamsDestroyCommand } from './streams-destroy-command';
import { ServerUnregisterCommand } from './server-unregister-command';
import { ServerRegisterCommand } from './server-register-command';
import { ServerRegistrationManager } from '../service/server-registration-manager';
import { ServerNotifyCommand } from './server-notify-command';
import { ServerDefaultCommand } from './server-default-command';
import { ServerChooseCommand } from './server-choose-command';
import { AppsRegisterCommand } from './apps-register-command';
import { AppsUnregisterCommand } from './apps-unregister-command';
import { StreamsLogCommand } from './streams-log-command';
import { StreamsShowCommand } from './streams-show-command';
import { ExplorerRefreshCommand } from './explorer-refresh-command';
import { StreamDebugLaunchCommand } from './stream-debug-launch-command';
import { StreamDebugAttachCommand } from './stream-debug-attach-command';
import { StreamsLogCloseallCommand } from './streams-log-closeall-command';
import { TasksCreateCommand } from './tasks-create-command';
import { TasksDestroyCommand } from './tasks-destroy-command';
import { TasksLaunchCommand } from './tasks-launch-command';
import { TasksLogCommand } from './tasks-log-command';
import { StreamsAppLogCommand } from './streams-app-log-command';
import { AppsRegisterAllCommand } from './apps-register-all-command';

const commandsContainerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind<ServerRegistrationManager>(TYPES.ServerRegistrationManager).to(ServerRegistrationManager).inSingletonScope();
    bind<Command>(DITYPES.Command).to(StreamsCreateCommand);
    bind<Command>(DITYPES.Command).to(StreamsDeployCommand);
    bind<Command>(DITYPES.Command).to(StreamsUndeployCommand);
    bind<Command>(DITYPES.Command).to(StreamsDestroyCommand);
    bind<Command>(DITYPES.Command).to(StreamDebugLaunchCommand);
    bind<Command>(DITYPES.Command).to(StreamDebugAttachCommand);
    bind<Command>(DITYPES.Command).to(ServerRegisterCommand);
    bind<Command>(DITYPES.Command).to(ServerUnregisterCommand);
    bind<Command>(DITYPES.Command).to(ServerNotifyCommand);
    bind<Command>(DITYPES.Command).to(ServerDefaultCommand);
    bind<Command>(DITYPES.Command).to(ServerChooseCommand);
    bind<Command>(DITYPES.Command).to(TasksLogCommand);
    bind<Command>(DITYPES.Command).to(TasksCreateCommand);
    bind<Command>(DITYPES.Command).to(TasksLaunchCommand);
    bind<Command>(DITYPES.Command).to(TasksDestroyCommand);
    bind<Command>(DITYPES.Command).to(AppsRegisterCommand);
    bind<Command>(DITYPES.Command).to(AppsRegisterAllCommand);
    bind<Command>(DITYPES.Command).to(AppsUnregisterCommand);
    bind<Command>(DITYPES.Command).to(StreamsLogCommand);
    bind<Command>(DITYPES.Command).to(StreamsAppLogCommand);
    bind<Command>(DITYPES.Command).to(StreamsLogCloseallCommand);
    bind<Command>(DITYPES.Command).to(StreamsShowCommand);
    bind<Command>(DITYPES.Command).to(ExplorerRefreshCommand);
});
export default commandsContainerModule;
