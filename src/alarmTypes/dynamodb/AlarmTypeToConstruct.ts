import { ReadThrottlingAlarm } from '@campionfellin/cdk-common-alarms'
import { AccountRCUAlarm } from '@campionfellin/cdk-common-alarms'
import { AccountWCUAlarm } from '@campionfellin/cdk-common-alarms'
import { TableRCUAlarm } from '@campionfellin/cdk-common-alarms'
import { TableWCUAlarm } from '@campionfellin/cdk-common-alarms'
import { WriteThrottlingAlarm } from '@campionfellin/cdk-common-alarms'

export const alarmTypeToConstruct: Record<string, any> = {
  'ReadThrottlingAlarm': ReadThrottlingAlarm,
  'AccountRCUAlarm': AccountRCUAlarm,
  'AccountWCUAlarm': AccountWCUAlarm,
  'TableRCUAlarm': TableRCUAlarm,
  'TableWCUAlarm': TableWCUAlarm,
  'WriteThrottlingAlarm': WriteThrottlingAlarm,
}