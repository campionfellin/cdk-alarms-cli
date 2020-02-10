import { ReadThrottlingAlarm } from './ReadThrottlingAlarm'
import { AccountRCUAlarm } from './AccountRCUAlarm'
import { AccountWCUAlarm } from './AccountWCUAlarm'
import { TableRCUAlarm } from './TableRCUAlarm'
import { TableWCUAlarm } from './TableWCUAlarm'
import { WriteThrottlingAlarm} from './WriteThrottlingAlarm'

export const alarmTypeToConstruct: Record<string, any> = {
  'ReadThrottlingAlarm': ReadThrottlingAlarm,
  'AccountRCUAlarm': AccountRCUAlarm,
  'AccountWCUAlarm': AccountWCUAlarm,
  'TableRCUAlarm': TableRCUAlarm,
  'TableWCUAlarm': TableWCUAlarm,
  'WriteThrottlingAlarm': WriteThrottlingAlarm,
}