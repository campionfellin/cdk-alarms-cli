import { LowRequestCountAlarm } from './LowRequestCountAlarm'
import { ErrorCountAlarm } from './ErrorCountAlarm'

export const alarmTypeToConstruct: any = {
  'LowRequestCountAlarm': LowRequestCountAlarm,
  'ErrorCountAlarm': ErrorCountAlarm
}