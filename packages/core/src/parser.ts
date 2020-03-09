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
  value: string | null
}

export function parseKey({ key, value, arrayFormat }: ParseKeyOptions) {
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
      isArray = `${value}`.indexOf(',') > -1
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
  customCallback?(value: string): never
}

export function parser({
  options: customOptions,
  type = UnqueryType.STRING,
  key,
  value,
  queryObject,
  innerType,
  customCallback
}: ParserOptions) {
  if (!innerType) {
    queryObject[key] = formatPrimitive(value, { type, customCallback })
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
