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

export interface TableWCUAlarmProps {
  tableName: string;
}

export class TableWCUAlarm extends Construct {
  constructor(scope: Construct, id: string, props: TableWCUAlarmProps) {
    super(scope, id)
    const MaxProvisionedTableWCU = new Metric({
      namespace: 'AWS/DynamoDB',
      metricName: 'MaxProvisionedTableWriteCapacityUtilization',
      dimensions: {
        TableName: props.tableName
      },
      period: Duration.minutes(5),
      statistic: 'Maximum',
      unit: Unit.PERCENT
    })
    
    new Alarm(scope, `${props.tableName}TableWCUAlarm`, {
      metric: MaxProvisionedTableWCU,
      evaluationPeriods: 1,
      threshold: 80.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default TableWCUAlarm