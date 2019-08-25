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
import { Container } from 'inversify';
import { coreContainerModule, TYPES as DITYPES } from '@pivotal-tools/vscode-extension-di';
import commandsContainerModule from './commands/di.config';
import { TYPES } from './types';
import { LanguageServerManager } from './language/core/language-server-manager';
import { ExtensionContext } from 'vscode';
import { LanguageSupport } from './language/core/language-support';
import { ScdfLanguageSupport } from './language/scdf-language-support';
import { AppsExplorerProvider } from './explorer/apps-explorer-provider';
import { StreamsExplorerProvider } from './explorer/streams-explorer-provider';

const container = new Container();
container.load(coreContainerModule, commandsContainerModule);

container.bind<LanguageSupport>(TYPES.LanguageSupport).to(ScdfLanguageSupport);
container.bind<LanguageServerManager>(TYPES.LanguageServerManager).toDynamicValue(
    context => {
        const extensionContext = context.container.get<ExtensionContext>(DITYPES.ExtensionContext);
        const languageSupports = context.container.getAll<LanguageSupport>(TYPES.LanguageSupport);
        return new LanguageServerManager(extensionContext, languageSupports);
    }
).inSingletonScope();
container.bind<AppsExplorerProvider>(TYPES.AppsExplorerProvider).to(AppsExplorerProvider).inSingletonScope();
container.bind<StreamsExplorerProvider>(TYPES.StreamsExplorerProvider).to(StreamsExplorerProvider).inSingletonScope();

export default container;
