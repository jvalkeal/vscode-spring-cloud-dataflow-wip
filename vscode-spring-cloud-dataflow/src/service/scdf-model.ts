import { Uri } from "vscode";
import { ScdfService } from "./scdf-service";

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

    constructor(readonly baseUri: string) {
        this.scdfService = new ScdfService();
    }

    public getApps(): Thenable<ScdfAppEntry[]> {
        return this.scdfService.getApps(this.baseUri);
    }

    public getStreams(): Thenable<ScdfStreamEntry[]> {
        return this.scdfService.getStreams(this.baseUri);
    }

    public getStreamDsl(streamName: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            resolve(this.scdfService.getStreamDsl(this.baseUri, streamName)
                .then(stream => stream.dslText));
        });
    }

    public registerApp(type: string, name: string, uri: string, metadataUri: string): Thenable<void> {
        return this.scdfService.registerApp(this.baseUri, type, name, uri, metadataUri);
    }

    public unregisterApp(type: string, name: string): Thenable<void> {
        return this.scdfService.unregisterApp(this.baseUri, type, name);
    }
}
