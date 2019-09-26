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
import { ExtensionContext } from 'vscode';
import { ContainerModule, decorate, injectable, inject } from 'inversify';
import {
    ExtensionActivateAware, ExtensionContextAware, SettingsManager, DefaultSettingsManager, NotificationManager,
    OutputManager
} from '@pivotal-tools/vscode-extension-core';
import { DITYPES } from './ditypes';
import { ExtensionActivateManager } from './extension-activate-manager';
import { CommandsManager } from './command/commands-manager';

const coreContainerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind<ExtensionActivateAware>(DITYPES.ExtensionActivateAware).to(ExtensionActivateManager);
    bind<ExtensionContextAware>(DITYPES.ExtensionContextAware).to(CommandsManager);
    bind<OutputManager>(DITYPES.OutputManager).toDynamicValue(() => new OutputManager()).inSingletonScope();
    bind<NotificationManager>(DITYPES.NotificationManager).toDynamicValue(() => new NotificationManager()).inSingletonScope();
    bind<SettingsManager>(DITYPES.SettingsManager).toDynamicValue(
        context => {
            const extensionContext = context.container.get<ExtensionContext>(DITYPES.ExtensionContext);
            return new DefaultSettingsManager(extensionContext);
        }
    );
});
export default coreContainerModule;
