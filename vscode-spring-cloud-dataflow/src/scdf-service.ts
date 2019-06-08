import axios from 'axios';
import { ScdfStreamEntry, ScdfAppEntry } from './scdf-model';

export class ScdfService {

    public getStreamDsl(baseUri: string, streamName: string): Thenable<ScdfStreamEntry> {
        return new Promise(async (resolve, reject) => {
            const response = await axios.get(baseUri + '/streams/definitions/' + streamName);
            resolve((response.data as ScdfStreamEntry));
        });
    }

    public getStreams(baseUri: string): Thenable<ScdfStreamEntry[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(baseUri + '/streams/definitions?page=0&size=1000');
                const data = (response.data._embedded &&
                    response.data._embedded.streamDefinitionResourceList) || [];
                resolve((data as ScdfStreamEntry[]));
            }
            catch (error) {
                resolve(([] as ScdfStreamEntry[]));
            }
        });
    }

    public getApps(baseUri: string): Thenable<ScdfAppEntry[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(baseUri + '/apps?page=0&size=1000');
                const data = (response.data._embedded &&
                    response.data._embedded.appRegistrationResourceList) || [];
                resolve((data as ScdfAppEntry[]));
            }
            catch (error) {
                resolve(([] as ScdfAppEntry[]));
            }
        });
    }
}
