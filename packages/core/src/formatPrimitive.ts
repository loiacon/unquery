import { UnqueryType, UnqueryTypeReturn } from './types'
import { dateTokens } from './utils/date'
import { provideOption } from './unqueryOptions'
import warn from './utils/warn'

const parseOptional = (val: string) => `0${val || 0}`.slice(-2)

const parseDate = (val: string, pattern: string) => {
  let date = {
    day: '',
    month: '',
    year: '',
    hours: '',
    minutes: '',
    seconds: ''
  }
  for (let i = 0; i < pattern.length; i++) {
    const token = dateTokens[pattern[i]]
    if (token) {
      date[token[1]] += val[i] || ''
    }
  }

  date = {
    ...date,
    hours: parseOptional(date.hours),
    minutes: parseOptional(date.minutes),
    seconds: parseOptional(date.seconds)
  }

  return new Date(
    `${date.year}-${date.month}-${date.day}T${date.hours}:${date.minutes}:${date.seconds}.000Z`
  )
}

const primitiveCreators = {
  [UnqueryType.string]: (val: string) => String(val),
  [UnqueryType.number]: (val: string) => Number(val),
  [UnqueryType.bool]: (val: string) => Boolean(val),
  [UnqueryType.date]: (val: string, pattern?: string) => {
    const date = parseDate(val, pattern)
    if (isNaN(date.getTime())) {
      warn(
        `Provided value "${date}" is not matching unquery pattern "${pattern}".`
      )
      return val
    }
    return date
  }
}

function formatPrimitive(
  value: string,
  { type, pattern }: UnqueryTypeReturn = {
    type: UnqueryType.string
  }
) {
  if (type === UnqueryType.date) {
    pattern = pattern || provideOption('parsePattern', 'pattern')
    return primitiveCreators[type](value, pattern)
  }
  return (primitiveCreators[type] && primitiveCreators[type](value)) || value
}

export default formatPrimitive
