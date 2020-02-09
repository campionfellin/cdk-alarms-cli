import { App, Stack, StackProps } from '@aws-cdk/core';
import { alarmTypeToConstruct } from './alarmTypes/lambda/AlarmTypeToConstruct';

export class LambdaAlarms extends Stack {
  constructor(scope: App, id: string, lambdas: string[], alarmTypes: string[], props?: StackProps) {
    super(scope, id, props);

    lambdas?.forEach((lambda: string) => {
      alarmTypes?.forEach((alarmType: string) => {
        new alarmTypeToConstruct[alarmType](this, `${lambda}-${alarmType}`, { lambdaName: lambda })
      })
    })
  }
}

export default LambdaAlarms