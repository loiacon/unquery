import { unqueryOptions } from './unqueryOptions'
import {
  UnqueryType,
  UnqueryOptions,
  UnqueryTypeReturn,
  UnqueryArrayTypes
} from './types'
import formatPrimitive from './formatPrimitive'

export interface ParseKeyOptions {
  key: string
  arrayFormat: UnqueryArrayTypes
}

export function parseKey({ key, arrayFormat }: ParseKeyOptions) {
  switch (arrayFormat) {
    case 'index':
      return key.replace(/\[\d*\]$/, '')
    case 'bracket':
      return key.replace(/\[\]$/, '')
    default:
      return key
  }
}

export interface ParserOptions {
  options: UnqueryOptions
  type: UnqueryType
  key: string
  value: string
  accumulator: object
  innerType?: UnqueryTypeReturn
  pattern?: string
}

export function parser({
  options = unqueryOptions,
  type = UnqueryType.string,
  key,
  value,
  accumulator,
  innerType,
  pattern
}: ParserOptions) {
  let result

  if (!innerType) {
    accumulator[key] = formatPrimitive(value, { type, pattern })
    return
  }

  switch (options.arrayFormat) {
    case 'index':
      if (accumulator[key] === undefined) {
        accumulator[key] = {}
      }
      accumulator[key][result[1]] = formatPrimitive(value, innerType)
      break
    case 'bracket':
      if (accumulator[key] === undefined) {
        accumulator[key] = [formatPrimitive(value, innerType)]
        return
      }
      accumulator[key] = [].concat(
        accumulator[key],
        formatPrimitive(value, innerType)
      )
      break
    case 'comma':
      accumulator[key] = value
        .split(',')
        .map(val => formatPrimitive(val, innerType))
      break
    default:
      if (accumulator[key] === undefined) {
        accumulator[key] = formatPrimitive(value, innerType)
        return
      }
      accumulator[key] = [
        ...accumulator[key],
        formatPrimitive(value, innerType)
      ]
  }
}
