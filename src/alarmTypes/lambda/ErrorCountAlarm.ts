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

export interface ErrorCountAlarmProps {
  lambdaName: string;
}

export class ErrorCountAlarm extends Construct {
  constructor(scope: Construct, id: string, props: ErrorCountAlarmProps) {
    super(scope, id)
    const LowRequestCount = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      dimensions: {
        FunctionName: props.lambdaName
      },
      period: Duration.minutes(5),
      statistic: 'Average',
      unit: Unit.COUNT
    })
    
    new Alarm(scope, `${props.lambdaName}HighErrorCount`, {
      metric: LowRequestCount,
      evaluationPeriods: 1,
      threshold: 10.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default ErrorCountAlarm