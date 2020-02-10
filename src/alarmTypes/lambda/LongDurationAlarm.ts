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

export interface LongDurationAlarmProps {
  lambdaName: string;
}

export class LongDurationAlarm extends Construct {
  constructor(scope: Construct, id: string, props: LongDurationAlarmProps) {
    super(scope, id)
    const LongDuration = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Duration',
      dimensions: {
        FunctionName: props.lambdaName
      },
      period: Duration.minutes(1),
      statistic: 'Maximum',
      unit: Unit.MILLISECONDS
    })
    
    new Alarm(scope, `${props.lambdaName}LongDuration`, {
      metric: LongDuration,
      evaluationPeriods: 1,
      threshold: 1000.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default LongDurationAlarm