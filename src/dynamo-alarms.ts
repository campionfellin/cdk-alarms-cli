import { App, Stack, StackProps } from '@aws-cdk/core';
import { alarmTypeToConstructor } from './config/AlarmTypeToConstructor';

export class DynamoAlarms extends Stack {
  constructor(scope: App, id: string, tables: string[], alarmTypes: string[], props?: StackProps) {
    super(scope, id, props);

    tables?.forEach((table: string) => {
      alarmTypes?.forEach((alarmType: string) => {
        alarmTypeToConstructor[alarmType](this, table)
      })
    })
  }
}

export default DynamoAlarms