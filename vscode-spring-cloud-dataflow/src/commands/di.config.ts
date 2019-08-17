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
import { Command, TYPES } from "@pivotal-tools/vscode-extension-di";
import { StreamsCreateCommand } from "./streams-create-command";
import { StreamsDeployCommand } from "./streams-deploy-command";
import { StreamsUndeployCommand } from "./streams-undeploy-command";
import { StreamsDestroyCommand } from "./streams-destroy-command";

const commandsContainerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind<Command>(TYPES.Command).to(StreamsCreateCommand);
    bind<Command>(TYPES.Command).to(StreamsDeployCommand);
    bind<Command>(TYPES.Command).to(StreamsUndeployCommand);
    bind<Command>(TYPES.Command).to(StreamsDestroyCommand);
});
export default commandsContainerModule;
