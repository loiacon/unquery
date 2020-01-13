/* eslint-disable @typescript-eslint/no-explicit-any */
import { splitOnFirst, extend } from './utils'
import { parser, parseKey } from './parser'
import {
  UnqueryObject,
  UnqueryOptions,
  UnqueryType,
  UnqueryTypeReturn
} from './types'
import { stringify } from './stringify'

// Unquery options
export const unqueryOptions: UnqueryOptions = {
  pattern: 'YYYY-MM-DD',
  arrayFormat: 'none',
  skipNull: false,
  skipUnknown: true
}

const Unquery = <T extends object, U extends UnqueryOptions>(
  input: string,
  shape: T,
  options?: U
) => {
  options = {
    ...unqueryOptions,
    ...((options as any) || {})
  }
  const { skipNull = false, skipUnknown = true, arrayFormat = 'none' } = options
  const ret: UnqueryObject<T> = Object.create({ stringify })

  if (typeof input !== 'string') {
    return ret
  }

  input = input.trim().replace(/^[?#&]/, '')

  if (input) {
    input.split('&').forEach(param => {
      let [key, value] = splitOnFirst(param, '=')

      key = parseKey({ key, arrayFormat })
      value = decodeURIComponent(value) || null

      if (!(key in shape) && skipUnknown) {
        return
      }

      const config = (shape[key] || {}) as UnqueryTypeReturn
      parser({ options, ...config, key, value, accumulator: ret })
    })
  }

  Object.keys(shape).forEach(key => {
    if (!skipNull && !ret[key]) {
      ret[key] = null
    }
  })

  return ret
}

/**
 * Set default options to be reused in all unquery strings
 */
Unquery.setOptions = (options: UnqueryOptions) => {
  extend(unqueryOptions, options)
  return unqueryOptions
}

// Unquery primitives
Unquery.string = (): string => ({ type: UnqueryType.string } as any)
Unquery.number = (): number => ({ type: UnqueryType.number } as any)
Unquery.bool = (): boolean => ({ type: UnqueryType.bool } as any)

Unquery.date = (pattern?: string): Date =>
  ({ type: UnqueryType.date, pattern } as any)
Unquery.array = <T extends string | number | boolean | Date>(
  innerType?: T
): T[] => {
  return {
    type: UnqueryType.array,
    innerType: innerType || UnqueryType.string
  } as any
}

// Export
export default Unquery
