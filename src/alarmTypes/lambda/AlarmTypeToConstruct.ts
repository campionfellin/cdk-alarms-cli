import { LowRequestCountAlarm } from './LowRequestCountAlarm'
import { HighAverageErrorCountAlarm } from './HighAverageErrorCountAlarm'
import AnyErrorCountAlarm from './AnyErrorCountAlarm'
import LongDurationAlarm from './LongDurationAlarm'
import AnyThrottlesAlarm from './AnyThrottlesAlarm'

export const alarmTypeToConstruct: Record<string, any> = {
  'LowRequestCountAlarm': LowRequestCountAlarm,
  'HighAverageErrorCountAlarm': HighAverageErrorCountAlarm,
  'AnyErrorCountAlarm': AnyErrorCountAlarm,
  'LongDurationAlarm': LongDurationAlarm,
  'AnyThrottlesAlarm': AnyThrottlesAlarm,
}