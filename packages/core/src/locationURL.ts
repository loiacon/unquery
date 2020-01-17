import { StringifyOptions, stringify } from './stringify'

type LocationQuery<T> = { [k in keyof T]: T[k] } | string

const updateHistory = (url = '') =>
  history.replaceState(null, null, `${location.pathname}${url}${location.hash}`)

const requery = <T extends object>(
  query: LocationQuery<T>,
  options?: StringifyOptions
) =>
  typeof query === 'string'
    ? query.trim().replace(/^[?#&]/, '')
    : stringify(query, options)

/** Replace all URL search */
export const replaceLocationURL = <T extends object>(
  query: LocationQuery<T>,
  options?: StringifyOptions
) => {
  updateHistory(`?${requery(query, options)}`)
}

/** Add query-string without removing other search */
export const addLocationURL = <T extends object>(
  query: LocationQuery<T>,
  options?: StringifyOptions
) => {
  const token = location.search ? '&' : '?'
  updateHistory(`${location.search}${token}${requery(query, options)}`)
}

/** Clear current URL search */
export const clearLocationURL = () => updateHistory()
