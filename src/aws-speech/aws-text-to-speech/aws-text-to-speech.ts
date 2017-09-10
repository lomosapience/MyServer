'use strict';
import * as nconf from 'nconf';
import {AwsWrapper} from "../../utils/aws-wrapper";

nconf.argv().env().file('server-config', 'server-config.json');

export class AwsTextToSpeech {

    private awsWrapper: AwsWrapper;

    constructor() {
        this.awsWrapper = new AwsWrapper();
    }

    textToSpeech(req, res): void {
        this.awsWrapper.textToSpeech(req, res);
    }
}