import { 
  Duration,
  Construct
} from '@aws-cdk/core';
import {
  Alarm,
  Metric,
  Unit,
  ComparisonOperator
} from '@aws-cdk/aws-cloudwatch'

export interface AccountWCUAlarmProps {
  tableName: string;
}

export class AccountWCUAlarm extends Construct {
  constructor(scope: Construct, id: string, props: AccountWCUAlarmProps) {
    super(scope, id)
    const AccountProvisionedWCU = new Metric({
      namespace: 'AWS/DynamoDB',
      metricName: 'AccountProvisionedWriteCapacityUtilization',
      dimensions: {
        TableName: props.tableName
      },
      period: Duration.minutes(5),
      statistic: 'Maximum',
      unit: Unit.PERCENT
    })
    
    new Alarm(scope, `${props.tableName}AccountProvisionedWCU`, {
      metric: AccountProvisionedWCU,
      evaluationPeriods: 1,
      threshold: 80.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default AccountWCUAlarm