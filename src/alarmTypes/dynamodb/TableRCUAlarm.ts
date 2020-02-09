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

export interface TableRCUAlarmProps {
  tableName: string;
}

export class TableRCUAlarm extends Construct {
  constructor(scope: Construct, id: string, props: TableRCUAlarmProps) {
    super(scope, id)
    const AccountProvisionedRCU = new Metric({
      namespace: 'AWS/DynamoDB',
      metricName: 'MaxProvisionedTableReadCapacityUtilization',
      dimensions: {
        TableName: props.tableName
      },
      period: Duration.minutes(5),
      statistic: 'Maximum',
      unit: Unit.PERCENT
    })
    
    new Alarm(scope, `${props.tableName}TableRCUAlarm`, {
      metric: AccountProvisionedRCU,
      evaluationPeriods: 1,
      threshold: 80.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default TableRCUAlarm