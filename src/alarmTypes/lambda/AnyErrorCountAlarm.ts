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

export interface AnyErrorCountAlarmProps {
  lambdaName: string;
}

export class AnyErrorCountAlarm extends Construct {
  constructor(scope: Construct, id: string, props: AnyErrorCountAlarmProps) {
    super(scope, id)
    const AnyErrorCount = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      dimensions: {
        FunctionName: props.lambdaName
      },
      period: Duration.minutes(1),
      statistic: 'Sum',
      unit: Unit.COUNT
    })
    
    new Alarm(scope, `${props.lambdaName}AnyErrorCount`, {
      metric: AnyErrorCount,
      evaluationPeriods: 1,
      threshold: 0.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default AnyErrorCountAlarm