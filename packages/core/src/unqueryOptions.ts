import { UnqueryOptions } from './types'
import { extend } from './utils'

/**
 * Initial unqueryOptions, this can be changed by calling setOptions
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
  extend(unqueryOptions, options)
  return unqueryOptions
}

export const provideOption = <T extends keyof UnqueryOptions>(
  ...args: T[]
): UnqueryOptions[T] => {
  for (let i = 0; i < args.length; i++) {
    const option = unqueryOptions[args[i]]
    if (option !== null) {
      return option
    }
  }
  return null
}
