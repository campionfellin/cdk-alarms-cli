#!/usr/bin/env node
/**
 * This isn't really used, as the CLI should do the Synthesis for you.
 */
import { App } from '@aws-cdk/core';
import { DynamoAlarms } from '../src/dynamo-alarms';

const app = new App();
new DynamoAlarms(app, 'DynamoAlarms', ['ExampleTable1', 'ExampleTable1'], ['ExampleAlarm1', 'ExampleAlarm2']);
app.synth()