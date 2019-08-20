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
import { IKeytar, Keytar } from './keytar';

export interface SettingsManager {

    getNonsensitive<T>(key: string): Thenable<T | undefined>;
    setNonsensitive<T>(key: string, value: any): Thenable<void>;
    deleteNonsensitive<T>(key: string): Thenable<void>;
    getSensitive<T>(key: string): Thenable<T | undefined>;
    setSensitive<T>(key: string, value: any): Thenable<void>;
    deleteSensitive<T>(key: string): Thenable<void>;
}

export class DefaultSettingsManager implements SettingsManager/*, ExtensionContextAware*/ {

    private keytar: IKeytar;
    private serviceId: string = 'vscode-spring-cloud-dataflow';

    constructor(private context: ExtensionContext) {
        const kt = Keytar.tryCreate();
        if (kt) {
            this.keytar = kt;
        } else {
            throw new Error("Internal error: Could not find keytar module for reading and writing passwords");
        }
    }

    public getNonsensitive<T>(key: string): Thenable<T | undefined> {
        return Promise.resolve(this.context.globalState.get(key));
    };

    public setNonsensitive<T>(key: string, value: any): Thenable<void> {
        return this.context.globalState.update(key, value);
    };

    public deleteNonsensitive<T>(key: string): Thenable<void> {
        return this.context.globalState.update(key, undefined);
    };

    public getSensitive<T>(key: string): Thenable<T | undefined> {
        return new Promise(async (resolve, reject) => {
            const data = await this.keytar.getPassword(this.serviceId, key);
            const credentials = <T>JSON.parse(data || '');
            resolve(credentials);
        });
    };

    public setSensitive<T>(key: string, value: any): Thenable<void> {
        return this.keytar.setPassword(this.serviceId, key, value);
    };

    public deleteSensitive<T>(key: string): Thenable<void> {
        return new Promise(async (resolve, reject) => {
            await this.keytar.deletePassword(this.serviceId, key);
            resolve();
        });
    };
}
