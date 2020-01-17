import { UnqueryOptions } from './types'
import { extend } from './utils'

/**
 * Initial unqueryOptions, this can be changed by calling setOptions
 */
export const unqueryOptions: UnqueryOptions = {
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
