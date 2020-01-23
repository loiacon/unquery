import { UnqueryOptions } from './types'
import { isObject } from './utils'
import warn from './utils/warn'

/**
 * Initial unqueryOptions, this can be changed by calling `setOptions`
 */
export const unqueryOptions: UnqueryOptions = {
  parsePattern: null,
  encodePattern: null,
  pattern: 'YYYY-MM-DD',
  arrayFormat: 'none',
  skipNull: false,
  skipUnknown: true
}

/** Change global unqueryOptions */
export const setOptions = (options: UnqueryOptions) => {
  if (isObject(options)) {
    for (const key in options) {
      key in unqueryOptions && (unqueryOptions[key] = options[key])
    }
  } else {
    warn(`Updated options "${options}" was not an object`)
  }
  return unqueryOptions
}

export const provideOption = <T extends keyof UnqueryOptions>(
  ...optionsKey: T[]
): UnqueryOptions[T] => {
  for (const key of optionsKey) {
    const option = unqueryOptions[key]
    if (option != null) {
      return option
    }
  }
  return null
}
