/* eslint-disable @typescript-eslint/no-explicit-any */
import { splitOnFirst } from './utils'
import { parser, parseKey } from './parser'
import {
  UnqueryObject,
  UnqueryOptions,
  UnqueryType,
  UnqueryTypeReturn
} from './types'
import { unqueryOptions, setOptions } from './unqueryOptions'
import { stringify } from './stringify'
import { addLocationURL, clearLocationURL } from './locationURL'

const unqueryMethods = {
  stringify,
  addLocationURL,
  clearLocationURL
}

const Unquery = <T extends object>(
  input: string,
  shape: T,
  options?: UnqueryOptions
) => {
  options = {
    ...unqueryOptions,
    ...((options as any) || {})
  }
  const { skipNull = false, skipUnknown = true, arrayFormat = 'none' } = options
  const ret: UnqueryObject<T> = Object.create(unqueryMethods)

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

Unquery.setOptions = setOptions

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
