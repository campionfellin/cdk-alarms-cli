import { 
  Duration,
  Construct
} from '@aws-cdk/core';
import {
  Alarm,
  Metric,
  Unit,
  MathExpression,
  ComparisonOperator
} from '@aws-cdk/aws-cloudwatch'

export interface WriteThrottlingAlarmProps {
  tableName: string;
}

export class WriteThrottlingAlarm extends Construct {
  constructor(scope: Construct, id: string, props: WriteThrottlingAlarmProps) {
    super(scope, id)
    const WriteThrottleEvents = new Metric({
      namespace: 'AWS/DynamoDB',
      metricName: 'WriteThrottleEvents',
      dimensions: {
        TableName: props.tableName
      },
      period: Duration.minutes(1),
      statistic: 'SampleCount',
      unit: Unit.COUNT
    })
  
    const ConsumedWriteCapacityUnits = new Metric({
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedWriteCapacityUnits',
      dimensions: {
        TableName: props.tableName
      },
      period: Duration.minutes(1),
      statistic: 'SampleCount',
      unit: Unit.COUNT
    })
  
    const rteOverWCU = new MathExpression({
      expression: "(rte / consumedWcu) * 100",
      usingMetrics: {
        rte: WriteThrottleEvents,
        consumedWcu: ConsumedWriteCapacityUnits
      }
    })
  
    new Alarm(scope, `${props.tableName}WriteThrottlingAlarm`, {
      metric: rteOverWCU,
      evaluationPeriods: 2,
      threshold: 2.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default WriteThrottlingAlarm