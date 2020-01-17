import { UnqueryArrayOptions, UnqueryDateOptions } from './types'
import { provideOption } from './unqueryOptions'
import { dateTokens } from './utils/date'
import { extend } from './utils'

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

        if (value instanceof Date) {
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
    case 'comma':
      return `${key}=${arr
        .map(value =>
          value instanceof Date ? dateFormatter(value, '', pattern) : value
        )
        .join(',')}`
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
  queryObject: { [k: string]: unknown },
  options: StringifyOptions
) {
  const { arrayFormat, pattern } = extend(stringifyOptions(), options)
  const keys = Object.keys(queryObject)

  return keys
    .map(key => {
      const value = queryObject[key]
      if (!value) {
        return ''
      }
      if (Array.isArray(value)) {
        return arrayFormatter(value, key, arrayFormat, pattern)
      }
      if (value instanceof Date) {
        return dateFormatter(value, key, pattern)
      }
      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('&')
}
