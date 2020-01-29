import { UnqueryArrayOptions, UnqueryDateOptions } from './types'
import { provideOption } from './unqueryOptions'
import { dateTokens } from './utils/date'
import { isString, isDate, isArray, encode } from './utils'

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
  pattern = encode(pattern)

  if (!key) {
    return pattern
  }
  return `${key}=${pattern}`
}

const createPairFunction = (arr: unknown[], pattern: string) => {
  const createPair = (key: (index: number) => string) => {
    return arr
      .map((value, index) => {
        const pairKey = key(index)

        if (isDate(value)) {
          return dateFormatter(value, pairKey, pattern)
        }
        return `${pairKey}=${value}`
      })
      .join('&')
  }

  return createPair
}

const arrayFormatter = (
  arr: unknown[],
  key: string,
  arrayFormat: UnqueryArrayOptions['arrayFormat'],
  pattern?: string
) => {
  const createPair = createPairFunction(arr, pattern)

  switch (arrayFormat) {
    case 'comma': {
      const value = arr
        .map(val => (isDate(val) ? dateFormatter(val, '', pattern) : val))
        .join(',')

      return value ? `${key}=${value}` : null
    }
    case 'index':
      return createPair(i => `${key}[${i}]`)
    case 'bracket':
      return createPair(() => `${key}[]`)
    default:
      return createPair(() => `${key}`)
  }
}

export type StringifyOptions = UnqueryArrayOptions & UnqueryDateOptions
const stringifyOptions = (): StringifyOptions => ({
  arrayFormat: provideOption('arrayFormat'),
  pattern: provideOption('encodePattern', 'pattern')
})

export function stringify(
  query: { [k: string]: unknown } | string,
  options?: StringifyOptions
) {
  if (isString(query)) {
    return query.trim().replace(/^[?#&]/, '')
  }
  const { arrayFormat, pattern } = { ...stringifyOptions(), ...options }

  return Object.keys(query)
    .map(key => {
      const value = query[key]
      if (value == null) {
        return ''
      }
      if (isArray(value)) {
        return arrayFormatter(value, key, arrayFormat, pattern)
      }
      if (isDate(value)) {
        return dateFormatter(value, key, pattern)
      }
      return `${encode(key)}=${encode(value as string)}`
    })
    .filter(Boolean)
    .join('&')
}
