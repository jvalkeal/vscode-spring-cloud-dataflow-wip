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
import axios from 'axios';
import { ScdfStreamEntry, ScdfAppEntry } from './scdf-model';
import { ServerRegistration } from '../commands/server-registrations';

export class ScdfService {

    public getStreamDsl(registration: ServerRegistration, streamName: string): Thenable<ScdfStreamEntry> {
        return new Promise(async (resolve, reject) => {
            const response = await axios.get(
                registration.url + '/streams/definitions/' + streamName, {
                    auth: registration.credentials
            });
            resolve((response.data as ScdfStreamEntry));
        });
    }

    public getStreams(registration: ServerRegistration): Thenable<ScdfStreamEntry[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(registration.url + '/streams/definitions?page=0&size=1000', {
                    auth: registration.credentials
                });
                const data = (response.data._embedded &&
                    response.data._embedded.streamDefinitionResourceList) || [];
                resolve((data as ScdfStreamEntry[]));
            }
            catch (error) {
                resolve(([] as ScdfStreamEntry[]));
            }
        });
    }

    public getApps(registration: ServerRegistration): Thenable<ScdfAppEntry[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(registration.url + '/apps?page=0&size=1000', {
                    auth: registration.credentials
                });
                const data = (response.data._embedded &&
                    response.data._embedded.appRegistrationResourceList) || [];
                resolve((data as ScdfAppEntry[]));
            }
            catch (error) {
                resolve(([] as ScdfAppEntry[]));
            }
        });
    }

    public registerApp(registration: ServerRegistration, type: string, name: string, uri: string, metadataUri: string): Thenable<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.post(registration.url + '/apps/' + type + '/' + name, {}, {
                    params: {
                        uri: uri,
                        force: false,
                        'metadata-uri': metadataUri
                    },
                    auth: registration.credentials
                });
                resolve();
            }
            catch (error) {
                resolve();
            }
        });
    }

    public unregisterApp(registration: ServerRegistration, type: string, name: string): Thenable<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.delete(registration.url + '/apps/' + type + '/' + name, {
                    auth: registration.credentials
                });
                resolve();
            }
            catch (error) {
                resolve();
            }
        });
    }
}
