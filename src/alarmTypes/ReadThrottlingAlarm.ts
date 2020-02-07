import { 
  Stack,
  Duration
} from '@aws-cdk/core';
import {
  Alarm,
  Metric,
  Unit,
  MathExpression,
  ComparisonOperator
} from '@aws-cdk/aws-cloudwatch'

export const ReadThrottlingAlarm = (stack: Stack, tableName: string) => {
  const ReadThrottleEvents = new Metric({
    namespace: 'AWS/DynamoDB',
    metricName: 'ReadThrottleEvents',
    dimensions: {
      TableName: tableName
    },
    period: Duration.minutes(1),
    statistic: 'SampleCount',
    unit: Unit.COUNT
  })

  const ConsumedReadCapacityUnits = new Metric({
    namespace: 'AWS/DynamoDB',
    metricName: 'ConsumedReadCapacityUnits',
    dimensions: {
      TableName: tableName
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

  return new Alarm(stack, `${tableName}ReadThrottlingAlarm`, {
    metric: rteOverRCU,
    evaluationPeriods: 2,
    threshold: 2.0,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
  })
}

export default ReadThrottlingAlarm