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
import { Uri } from "vscode";
import { ScdfService } from "./scdf-service";
import { ServerRegistration } from "../commands/server-registrations";

export interface BaseEntry {
    _links: {self: Uri};
}

export interface ScdfAppEntry extends BaseEntry {
    defaultVersion: boolean;
    name: string;
    type: string;
    uri: string;
    version: string;
}

export interface ScdfStreamEntry extends BaseEntry {
    name: string;
    dslText: string;
    status: string;
    statusDescription: string;
}

export interface ScdfNode {
    name: string;
    resource: Uri;
}

export class ScdfModel {

    private scdfService: ScdfService;

    constructor(readonly registration: ServerRegistration) {
        this.scdfService = new ScdfService();
    }

    public getApps(): Thenable<ScdfAppEntry[]> {
        return this.scdfService.getApps(this.registration);
    }

    public getStreams(): Thenable<ScdfStreamEntry[]> {
        return this.scdfService.getStreams(this.registration);
    }

    public getStreamDsl(streamName: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            resolve(this.scdfService.getStreamDsl(this.registration, streamName)
                .then(stream => stream.dslText));
        });
    }

    public registerApp(type: string, name: string, uri: string, metadataUri: string): Thenable<void> {
        return this.scdfService.registerApp(this.registration, type, name, uri, metadataUri);
    }

    public unregisterApp(type: string, name: string): Thenable<void> {
        return this.scdfService.unregisterApp(this.registration, type, name);
    }
}
