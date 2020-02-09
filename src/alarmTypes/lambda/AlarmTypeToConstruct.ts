import { LowRequestCountAlarm } from './LowRequestCountAlarm'
import { ErrorCountAlarm } from './ErrorCountAlarm'

export const alarmTypeToConstruct: Record<string, any> = {
  'LowRequestCountAlarm': LowRequestCountAlarm,
  'ErrorCountAlarm': ErrorCountAlarm
}