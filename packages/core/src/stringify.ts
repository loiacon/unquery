import { UnqueryArrayOptions } from './types'
import { provideOption } from './unqueryOptions'
import { isString, isArray, encode } from './utils'

const createPairFunction = (arr: unknown[]) => {
  const createPair = (key: (index: number) => string) => {
    return arr
      .map((value, index) => {
        return `${key(index)}=${encode(value as string)}`
      })
      .join('&')
  }

  return createPair
}

const arrayFormatter = (
  arr: unknown[],
  key: string,
  arrayFormat: UnqueryArrayOptions['arrayFormat']
) => {
  if (arrayFormat === 'comma') {
    const value = arr.map((val) => encode(val as string)).join(',')

    return value ? `${key}=${value}` : null
  }
  const createPair = createPairFunction(arr)

  switch (arrayFormat) {
    case 'index':
      return createPair((i) => `${key}[${i}]`)
    case 'bracket':
      return createPair(() => `${key}[]`)
    default:
      return createPair(() => `${key}`)
  }
}

export type StringifyOptions = UnqueryArrayOptions
const stringifyOptions = (): StringifyOptions => ({
  arrayFormat: provideOption('arrayFormat'),
})

/** Stringify a query object into string */
export function stringify(
  query: { [k: string]: unknown } | string,
  options?: StringifyOptions
) {
  if (isString(query)) {
    return query.trim().replace(/^[?#&]/, '')
  }
  const { arrayFormat } = { ...stringifyOptions(), ...options }

  return Object.keys(query)
    .map((key) => {
      const value = query[key]
      if (value == null) {
        return ''
      }
      if (isArray(value)) {
        return arrayFormatter(value, key, arrayFormat)
      }
      return `${encode(key)}=${encode(value as string)}`
    })
    .filter(Boolean)
    .join('&')
}
