import { App, Stack, StackProps } from '@aws-cdk/core';
import { alarmTypeToConstruct } from './alarmTypes/dynamodb/AlarmTypeToConstruct';

export class DynamoAlarms extends Stack {
  constructor(scope: App, id: string, tables: string[], alarmTypes: string[], props?: StackProps) {
    super(scope, id, props);

    tables?.forEach((table: string) => {
      alarmTypes?.forEach((alarmType: string) => {
        new alarmTypeToConstruct[alarmType](this, `${table}-${alarmType}`, { tableName: table })
      })
    })
  }
}

export default DynamoAlarms