/* eslint-disable @typescript-eslint/no-explicit-any */
import { splitOnFirst } from './utils'
import { parser, parseKey } from './parser'
import {
  UnqueryObject,
  UnqueryOptions,
  UnqueryType,
  UnqueryTypeReturn
} from './types'
import { unqueryOptions, setOptions, provideOption } from './unqueryOptions'
import { stringify, StringifyOptions } from './stringify'

const unqueryMethods = {
  stringify(options?: StringifyOptions) {
    return stringify(this, options)
  }
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
      const [rawKey, rawValue] = splitOnFirst(param, '=')

      const { key, isArray } = parseKey({ key: rawKey, arrayFormat })
      const value = decodeURIComponent(rawValue) || null
      const isUnknown = !(key in shape)

      if (isUnknown && skipUnknown) {
        return
      }

      const rawConfig = {
        innerType: isArray && isUnknown ? Unquery.string() : null
      }
      const shapeConfig = shape[key] || {}
      const config = {
        ...rawConfig,
        ...shapeConfig,
        pattern: shapeConfig.pattern || provideOption('parsePattern', 'pattern')
      } as UnqueryTypeReturn

      parser({ options, ...config, key, value, queryObject: ret })
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
