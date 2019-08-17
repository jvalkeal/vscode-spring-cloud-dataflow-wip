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
import { ContainerModule } from "inversify";
import { TYPES } from "./types";
import { ExtensionActivateAware } from "./extension-activate-aware";
import { ExtensionContextAware } from "./extension-context-aware";
import { ExtensionActivateManager } from "./extension-activate-manager";
import { CommandsManager } from "./command/commands-manager";

const coreContainerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind<ExtensionActivateAware>(TYPES.ExtensionActivateAware).to(ExtensionActivateManager);
    bind<ExtensionContextAware>(TYPES.ExtensionContextAware).to(CommandsManager);
});

export default coreContainerModule;
