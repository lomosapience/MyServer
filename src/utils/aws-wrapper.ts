'use strict';
import * as AWS from 'aws-sdk';
import * as nconf from 'nconf';
import * as Speaker from 'speaker';
import { Stream } from 'stream';

nconf.argv().env().file('server-config', 'server-config.json');
const OUTPUT_FORMAT: string = 'pcm';
const REGION: string = 'us-east-1';
const SIGNATURE_VERSION: string = 'v4';

export class AwsWrapper {

    private static getCredentials() {
        let credentials = nconf.get((process.env.NODE_ENV || 'dev') + ':aws');
        return new AWS.Credentials(credentials.accessKeyId, credentials.secretAccessKey, null);
    }

    textToSpeech(req, res) {

        AWS.config.credentials = AwsWrapper.getCredentials();
        const polly = new AWS.Polly({
            signatureVersion: SIGNATURE_VERSION,
            region: REGION
        });

        const player = new Speaker({
            channels: 1,
            bitDepth: 16,
            sampleRate: 16000
        });

        let params = {
            'Text': req.body.text,
            'OutputFormat': OUTPUT_FORMAT,
            'VoiceId': req.body.voiceId
        };

        polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                console.log(err.code)
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {
                    // Initiate the source
                    let bufferStream = new Stream.PassThrough();
                    // convert AudioStream into a readable stream
                    bufferStream.end(data.AudioStream);
                    // Pipe into Player
                    bufferStream.pipe(player);
                    res.send(200, 'successful');
                }
            }
        });
    }
}
