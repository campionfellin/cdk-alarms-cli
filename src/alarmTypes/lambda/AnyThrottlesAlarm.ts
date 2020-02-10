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

export interface AnyThrottlesAlarmProps {
  lambdaName: string;
}

export class AnyThrottlesAlarm extends Construct {
  constructor(scope: Construct, id: string, props: AnyThrottlesAlarmProps) {
    super(scope, id)
    const AnyThrottles = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Throttles',
      dimensions: {
        FunctionName: props.lambdaName
      },
      period: Duration.minutes(1),
      statistic: 'Sum',
      unit: Unit.COUNT
    })
    
    new Alarm(scope, `${props.lambdaName}AnyThrottles`, {
      metric: AnyThrottles,
      evaluationPeriods: 1,
      threshold: 0.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    })
  }
}

export default AnyThrottlesAlarm