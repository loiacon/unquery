import { StringifyOptions, stringify } from './stringify'
import warn from './utils/warn'

export function addLocationURL<T extends object>(
  queryObject: { [k: string]: unknown },
  options?: StringifyOptions
) {
  if (typeof window === 'undefined') {
    warn(`To use "addLocationURL" you need to be in client-side`)
    return
  }
  history.replaceState(
    null,
    null,
    `?${stringify(queryObject, options)}${location.hash}`
  )
}

export function clearLocationURL() {
  if (typeof window === 'undefined') {
    warn(`To use "clearLocationURL" you need to be in client-side`)
    return
  }
  history.replaceState(null, null, `${location.pathname}${location.hash}`)
}
