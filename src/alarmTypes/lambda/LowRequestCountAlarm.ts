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

export interface LowRequestCountAlarmProps {
  lambdaName: string;
}

export class LowRequestCountAlarm extends Construct {
  constructor(scope: Construct, id: string, props: LowRequestCountAlarmProps) {
    super(scope, id)
    const LowRequestCount = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Invocations',
      dimensions: {
        FunctionName: props.lambdaName
      },
      period: Duration.minutes(5),
      statistic: 'Average',
      unit: Unit.COUNT
    })
    
    new Alarm(scope, `${props.lambdaName}LowInvocations`, {
      metric: LowRequestCount,
      evaluationPeriods: 1,
      threshold: 10.0,
      comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD
    })
  }
}

export default LowRequestCountAlarm