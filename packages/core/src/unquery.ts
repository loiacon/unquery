/* eslint-disable @typescript-eslint/no-explicit-any */
import { splitQuery, isString, safeDecodeURI, isArray } from './utils'
import { parser, parseKey } from './parser'
import {
  UnqueryObject,
  UnqueryOptions,
  UnqueryType,
  UnqueryTypeReturn
} from './types'
import { unqueryOptions, provideOption } from './unqueryOptions'
import { stringify, StringifyOptions } from './stringify'

const unqueryMethods = {
  stringify(options?: StringifyOptions) {
    return stringify(this, options)
  }
}

export const Unquery = <T extends object>(
  input: string,
  shape: T = {} as any,
  options?: UnqueryOptions
) => {
  options = {
    ...unqueryOptions,
    ...((options as any) || {})
  }
  const { skipNull, skipUnknown, arrayFormat } = options
  const ret: UnqueryObject<T> = Object.create(unqueryMethods)

  if (!isString(input)) {
    return ret
  }

  input = input.trim().replace(/^[?#&]/, '')

  if (input) {
    input.split('&').forEach(param => {
      const [rawKey = param, rawValue] = splitQuery(param)

      const { key, isArray: isArr } = parseKey({
        key: safeDecodeURI(rawKey),
        arrayFormat
      })
      const value = rawValue != null ? safeDecodeURI(rawValue) : null
      const isUnknown = !(key in shape)

      if (isUnknown && skipUnknown) {
        return
      }

      const shapeConfig = shape[key] || {}
      const config = {
        // Set default innerType when
        // matched value isArray and isUnknown value
        innerType: isArr && isUnknown && Unquery.string(),
        ...shapeConfig,
        pattern: shapeConfig.pattern || provideOption('parsePattern', 'pattern')
      } as UnqueryTypeReturn

      if (options.arrayFormat === 'comma') {
        ret[key] = null
      }
      // Parsed value will be stored in unquery ret
      parser({ options, ...config, key, value, queryObject: ret })
    })
  }

  Object.keys(shape).forEach(key => {
    // If value is null and exists in shape
    // but is not in current input, set value to null
    const value = ret[key] as any
    if (
      (!skipNull && value == null) ||
      (isArray(value) && value.length === 1 && value[0] === null)
    ) {
      ret[key] = null
    }
  })

  return ret
}

// Unquery primitives
Unquery.string = (): string => ({ type: UnqueryType.string } as any)
Unquery.number = (): number => ({ type: UnqueryType.number } as any)
Unquery.bool = (): boolean => ({ type: UnqueryType.bool } as any)

Unquery.date = (pattern?: string): Date =>
  ({ type: UnqueryType.date, pattern } as any)

Unquery.array = <T extends string | number | boolean | Date>(
  innerType?: T
): T[] =>
  ({
    type: UnqueryType.array,
    innerType: innerType || UnqueryType.string
  } as any)
