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
