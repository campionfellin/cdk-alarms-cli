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

export interface ReadThrottlingAlarmProps {
  tableName: string;
}

export class ReadThrottlingAlarm extends Construct {
  constructor(scope: Construct, id: string, props: ReadThrottlingAlarmProps) {
    super(scope, id)
    const ReadThrottleEvents = new Metric({
      namespace: 'AWS/DynamoDB',
      metricName: 'ReadThrottleEvents',
      dimensions: {
        TableName: props.tableName
      },
      period: Duration.minutes(1),
      statistic: 'SampleCount',
      unit: Unit.COUNT
    })
  
    const ConsumedReadCapacityUnits = new Metric({
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedReadCapacityUnits',
      dimensions: {
        TableName: props.tableName
      },
      period: Duration.minutes(1),
      statistic: 'SampleCount',
      unit: Unit.COUNT
    })
  
    const rteOverRCU = new MathExpression({
      expression: "(rte / consumedRcu) * 100",
      usingMetrics: {
        rte: ReadThrottleEvents,
        consumedRcu: ConsumedReadCapacityUnits
      }
    })
  
    new Alarm(scope, `${props.tableName}ReadThrottlingAlarm`, {
      metric: rteOverRCU,
      evaluationPeriods: 2,
      threshold: 2.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default ReadThrottlingAlarm