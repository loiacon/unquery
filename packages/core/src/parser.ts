import { unqueryOptions } from './unqueryOptions'
import {
  UnqueryType,
  UnqueryOptions,
  UnqueryTypeReturn,
  UnqueryArrayTypes
} from './types'
import formatPrimitive from './formatPrimitive'
import { isString } from './utils'

export interface ParseKeyOptions {
  key: string
  arrayFormat: UnqueryArrayTypes
}

export function parseKey({ key, arrayFormat }: ParseKeyOptions) {
  let isArray

  switch (arrayFormat) {
    case 'index':
      isArray = /\[(\d*)\]$/.test(key)
      key = key.replace(/\[(\d*)\]$/, '')
      break
    case 'bracket': {
      isArray = /\[\]$/.test(key)
      key = key.replace(/\[\]$/, '')
      break
    }
    case 'comma':
      isArray = isString(key) && key.indexOf(',') > -1
      break
    default:
      break
  }
  return { key, isArray }
}

export interface ParserOptions {
  options: UnqueryOptions
  type: UnqueryType
  key: string
  value: string
  queryObject: object
  innerType?: UnqueryTypeReturn
  pattern?: string
}

export function parser({
  options = unqueryOptions,
  type = UnqueryType.string,
  key,
  value,
  queryObject,
  innerType,
  pattern
}: ParserOptions) {
  if (!innerType) {
    queryObject[key] = formatPrimitive(value, { type, pattern })
    return
  }

  queryObject[key] && queryObject[key].push(formatPrimitive(value, innerType))

  switch (options.arrayFormat) {
    case 'index':
    case 'bracket':
      if (queryObject[key] === undefined) {
        queryObject[key] = [formatPrimitive(value, innerType)]
      }
      break
    case 'comma':
      queryObject[key] = value
        .split(',')
        .map(val => formatPrimitive(val, innerType))
      break
    default:
      if (queryObject[key] === undefined) {
        queryObject[key] = formatPrimitive(value, innerType)
      }
  }
}
