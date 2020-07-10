/* eslint-disable @typescript-eslint/no-explicit-any */
import { splitQuery, isString, safeDecodeURI, isArray } from './utils'
import { parser, parseKey } from './parser'
import {
  UnqueryObject,
  UnqueryOptions,
  UnqueryType,
  UnqueryTypeReturn,
  GenericObject,
} from './types'
import { unqueryOptions } from './unqueryOptions'

export const Unquery = <T extends GenericObject>(
  input: string,
  shape: T,
  options?: UnqueryOptions
) => {
  shape = shape || ({} as T)
  options = {
    ...unqueryOptions,
    ...(options || {}),
  }
  const { skipNull, skipUnknown, arrayFormat } = options
  const ret: GenericObject = Object.create({})

  if (!isString(input)) {
    return ret
  }

  input = input.trim().replace(/^[?#&]/, '')

  if (input) {
    input.split('&').forEach((param) => {
      const [rawKey = param, value] = splitQuery(param)

      const { key, isArray: isArr } = parseKey({
        key: safeDecodeURI(rawKey),
        value,
        arrayFormat,
      })
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
      } as UnqueryTypeReturn

      if (options.arrayFormat === 'comma') {
        // Should reset array when format is "comma"
        // to replace values correctly
        ret[key] = null
      }
      // Parsed value will be stored in unquery object
      parser({ options, ...config, key, value, queryObject: ret })
    })
  }

  Object.keys(shape).forEach((key) => {
    // If value is null and exists in shape
    // but is not in current input, set value to null
    const value = ret[key]
    if (
      (!skipNull && value == null) ||
      (isArray(value) && value.length === 1 && value[0] === null)
    ) {
      ret[key] = null
    }
  })

  return ret as UnqueryObject<T>
}

// Unquery primitives
Unquery.string = (): string => ({ type: UnqueryType.STRING } as any)
Unquery.number = (): number => ({ type: UnqueryType.NUMBER } as any)
Unquery.bool = (): boolean => ({ type: UnqueryType.BOOL } as any)
Unquery.array = <T extends string | number | boolean>(innerType?: T): T[] =>
  ({
    type: UnqueryType.ARRAY,
    innerType: innerType || UnqueryType.STRING,
  } as any)

Unquery.custom = <T>(callback?: (value: string) => T): T =>
  ({
    type: UnqueryType.CUSTOM,
    customCallback: callback || ((value) => value),
  } as any)
