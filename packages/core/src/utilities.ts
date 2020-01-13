import { UnqueryArrayOptions, UnqueryDateOptions } from './types'
import { unqueryOptions } from './unquery'
import { dateTokens } from './utils/date'

const arrayFormatter = (
  arr: unknown[],
  key: string,
  arrayFormat: UnqueryArrayOptions['arrayFormat']
) => {
  switch (arrayFormat) {
    case 'comma':
      return `${key}=${arr.join(',')}`
    case 'index':
      return arr.map((value, index) => `${key}[${index}]=${value}`).join('&')
    case 'bracket':
      return arr.map(value => `${key}[]=${value}`).join('&')
    default:
      return arr.map(value => `${key}=${value}`).join('&')
  }
}

const parseZero = (value: number) => `0${value}`.slice(-2)

const dateFormatter = (date: Date, key: string, pattern: string) => {
  const parsedDate = {
    day: parseZero(date.getUTCDate()),
    month: parseZero(date.getUTCMonth() + 1),
    hours: parseZero(date.getUTCHours()),
    year: `${date.getUTCFullYear()}`,
    minutes: parseZero(date.getUTCMinutes()),
    seconds: parseZero(date.getUTCSeconds())
  }

  for (let i = 0; i < pattern.length; i++) {
    const letter = pattern[i]

    const token = dateTokens[letter]
    if (token) {
      pattern = pattern.replace(token[0], parsedDate[token[1]])
    }
  }

  return `${key}=${pattern}`
}

type StringifyOptions = UnqueryArrayOptions & UnqueryDateOptions
const stringifyOptions = (): StringifyOptions => ({
  arrayFormat: unqueryOptions.arrayFormat,
  pattern: unqueryOptions.pattern
})

export function stringify(options: StringifyOptions) {
  const { arrayFormat, pattern } = {
    ...stringifyOptions(),
    ...(options || {})
  }
  const keys = Object.keys(this)

  return keys
    .map(key => {
      const value = this[key]
      if (!value) {
        return ''
      }
      if (Array.isArray(value)) {
        return arrayFormatter(value, key, arrayFormat)
      }
      if (value instanceof Date) {
        return dateFormatter(value, key, pattern)
      }
      return `${key}=${value}`
    })
    .filter(x => x.length > 0)
    .join('&')
}
