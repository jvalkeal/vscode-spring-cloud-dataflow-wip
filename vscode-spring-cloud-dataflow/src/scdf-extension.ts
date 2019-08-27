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
import 'reflect-metadata';
import { ExtensionContext } from 'vscode';
import { Container } from 'inversify';
import { TYPES as DITYPES, ExtensionActivateManager } from '@pivotal-tools/vscode-extension-di';
import { DiExtension } from './language/di/di-extension';
import { TYPES } from './types';
import commandsContainerModule from './commands/di.config';
import { ScdfLanguageSupport } from './language/scdf-language-support';
import { LanguageSupport } from './language/core/language-support';
import { LanguageServerManager } from './language/core/language-server-manager';
import { IconManager } from './language/core/icon-manager';
import { AppsExplorerProvider } from './explorer/apps-explorer-provider';
import { StreamsExplorerProvider } from './explorer/streams-explorer-provider';
import { StatusBarManager } from './language/core/status-bar-manager';

export class ScdfExtension extends DiExtension {

    constructor(
        context: ExtensionContext
    ){
        super(context, new Container());
    }

    public onDeactivate(context: ExtensionContext): void {
        super.onDeactivate(context);
    }

    public onContainer(container: Container): void {
        super.onContainer(container);
        container.load(commandsContainerModule);

        container.bind<LanguageSupport>(TYPES.LanguageSupport).to(ScdfLanguageSupport);
        container.bind<LanguageServerManager>(TYPES.LanguageServerManager).toDynamicValue(
            context => {
                const extensionContext = context.container.get<ExtensionContext>(DITYPES.ExtensionContext);
                const languageSupports = context.container.getAll<LanguageSupport>(TYPES.LanguageSupport);
                return new LanguageServerManager(extensionContext, languageSupports);
            }
        ).inSingletonScope();
        container.bind<IconManager>(TYPES.IconManager).toDynamicValue(
            context => {
                const extensionContext = context.container.get<ExtensionContext>(DITYPES.ExtensionContext);
                return new IconManager(extensionContext);
            }
        ).inSingletonScope();
        container.bind<AppsExplorerProvider>(TYPES.AppsExplorerProvider).to(AppsExplorerProvider).inSingletonScope();
        container.bind<StreamsExplorerProvider>(TYPES.StreamsExplorerProvider).to(StreamsExplorerProvider).inSingletonScope();
        container.bind<StatusBarManager>(TYPES.StatusBarManager).to(StatusBarManager).inSingletonScope();

        const appsExplorerProvider = container.get<AppsExplorerProvider>(TYPES.AppsExplorerProvider);
        const streamsExplorerProvider = container.get<StreamsExplorerProvider>(TYPES.StreamsExplorerProvider);
        const lsm = container.get<LanguageServerManager>(TYPES.LanguageServerManager);

    }

}
