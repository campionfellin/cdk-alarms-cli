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

export interface HighAverageErrorCountAlarmProps {
  lambdaName: string;
}

export class HighAverageErrorCountAlarm extends Construct {
  constructor(scope: Construct, id: string, props: HighAverageErrorCountAlarmProps) {
    super(scope, id)
    const HighAverageErrorCount = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      dimensions: {
        FunctionName: props.lambdaName
      },
      period: Duration.minutes(5),
      statistic: 'Average',
      unit: Unit.COUNT
    })
    
    new Alarm(scope, `${props.lambdaName}HighAverageErrorCount`, {
      metric: HighAverageErrorCount,
      evaluationPeriods: 1,
      threshold: 10.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default HighAverageErrorCountAlarm