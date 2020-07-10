/* eslint-disable @typescript-eslint/no-explicit-any */
export const { isArray } = Array
export const isString = (val: unknown): val is string => typeof val === 'string'
// eslint-disable-next-line @typescript-eslint/ban-types
export const isObject = (val: unknown): val is object =>
  val && typeof val === 'object' && !isArray(val)

export const splitQuery = (string: string) => {
  const separatorIndex = string.indexOf('=')

  if (separatorIndex === -1) {
    return []
  }

  return [string.slice(0, separatorIndex), string.slice(separatorIndex + 1)]
}

export const encode = (value: string | number | boolean) =>
  encodeURIComponent(value)

export const safeDecodeURI = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
