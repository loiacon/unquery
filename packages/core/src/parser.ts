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
  options: customOptions,
  type = UnqueryType.string,
  key,
  value,
  queryObject,
  innerType,
  pattern
}: ParserOptions) {
  if (!innerType) {
    queryObject[key] = formatPrimitive(value, { type, pattern })
  } else if (queryObject[key]) {
    queryObject[key].push(formatPrimitive(value, innerType))
  } else if (value == null) {
    queryObject[key] = [null]
  } else {
    const options = { ...unqueryOptions, ...customOptions }

    if (options.arrayFormat === 'comma') {
      queryObject[key] = value
        .split(',')
        .map(val => formatPrimitive(val, innerType))
    } else {
      queryObject[key] = [formatPrimitive(value, innerType)]
    }
  }
}
