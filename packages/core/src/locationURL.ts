import { StringifyOptions, stringify } from './stringify'

type LocationQuery<T> = { [k in keyof T]: T[k] } | string

const updateHistory = (url = '') =>
  history.replaceState(
    null,
    null,
    `${location.pathname.replace(/\/$/, '')}${url}${location.hash}`
  )

/** Replace all URL search */
export const replaceLocationURL = <T extends object>(
  query: LocationQuery<T>,
  options?: StringifyOptions
) => {
  const string = stringify(query, options)
  updateHistory(string && `?${string}`)
}

/** Add query-string without removing other search */
export const addLocationURL = <T extends object>(
  query: LocationQuery<T>,
  options?: StringifyOptions
) => {
  const token = location.search ? '&' : '?'
  updateHistory(`${location.search}${token}${stringify(query, options)}`)
}

/** Clear current URL search */
export const clearLocationURL = () => updateHistory()
