import { StringifyOptions } from './stringify'
import warn from './utils/warn'

export function addLocationURL<T extends object>(
  callback?: () => void,
  options?: StringifyOptions
) {
  if (typeof window === 'undefined') {
    warn(`To use "addLocationURL" you need to be in client-side`)
    return
  }
  history.replaceState(
    null,
    null,
    `?${this.stringify(options)}${location.hash}`
  )

  callback && callback()
}

export function clearLocationURL(callback?: () => void) {
  if (typeof window === 'undefined') {
    warn(`To use "clearLocationURL" you need to be in client-side`)
    return
  }
  history.replaceState(null, null, `${location.pathname}${location.hash}`)

  callback && callback()
}
