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
import { ExtensionContext } from "vscode";
import { multiInject, injectable } from "inversify";
import { ExtensionActivateAware } from "./extension-activate-aware";
import { ExtensionContextAware } from "./extension-context-aware";
import { TYPES } from "./types";

@injectable()
export class ExtensionActivateManager implements ExtensionActivateAware {

    constructor(
        @multiInject(TYPES.ExtensionContextAware) private awares: ExtensionContextAware[]
    ) {}

    onExtensionActivate(context: ExtensionContext) {
        for (const aware of this.awares) {
            aware.onExtensionContext(context);
        }
    }
}
