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
import * as path from 'path';
import { extensionGlobals } from '../extension-variables';

export namespace treeUtils {

    export interface ThemedIconPath {
        light: string;
        dark: string;
    }

    export function getIconPath(iconName: string): string {
        return path.join(getResourcesPath(), `${iconName}.svg`);
    }

    export function getThemedIconPath(iconName: string): ThemedIconPath {
        return {
            light: path.join(getResourcesPath(), 'light', `${iconName}.svg`),
            dark: path.join(getResourcesPath(), 'dark', `${iconName}.svg`)
        };
    }

    function getResourcesPath(): string {
        return extensionGlobals.context.asAbsolutePath('resources');
    }
}
