import { UnqueryType, UnqueryTypeReturn } from './types'
import { dateTokens } from './utils/date'
import { provideOption } from './unqueryOptions'
import warn from './utils/warn'
import { safeDecodeURI } from './utils'

const parseOptional = (val: string) => `0${val || 0}`.slice(-2)

type DateParser = {
  day: string
  month: string
  year: string
  hours?: string
  minutes?: string
  seconds?: string
}

const parseDate = (val: string, pattern: string) => {
  const date: DateParser = { day: '', month: '', year: '' }
  for (let i = 0; i < pattern.length; i++) {
    const token = dateTokens[pattern[i]]
    if (token) {
      date[token[1]] += val[i]
    }
  }

  date.hours = parseOptional(date.hours)
  date.minutes = parseOptional(date.minutes)
  date.seconds = parseOptional(date.seconds)

  return new Date(
    `${date.year}-${date.month}-${date.day}T${date.hours}:${date.minutes}:${date.seconds}.000Z`
  )
}

function formatPrimitive(value: string, { type, pattern }: UnqueryTypeReturn) {
  if (value == null) {
    return null
  }

  value = safeDecodeURI(value)
  if (type & UnqueryType.STRING) {
    return `${value}`
  }

  if (type & UnqueryType.NUMBER) {
    return value !== '' ? +value : null
  }

  if (type & UnqueryType.BOOL) {
    return Boolean(value)
  }

  if (type & UnqueryType.DATE) {
    pattern = pattern || provideOption('parsePattern', 'pattern')

    const date = parseDate(value, pattern)
    if (isNaN(date.getTime())) {
      warn(`Provided value "${value}" is not matching pattern "${pattern}".`)
      return value
    }
    return date
  }
  return value
}

export default formatPrimitive
