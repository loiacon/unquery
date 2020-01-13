/* eslint-disable @typescript-eslint/no-explicit-any */
export const extend = <T extends object, U extends object>(
  a: T,
  b: U
): T & U => {
  for (const key in b) {
    ;(a as any)[key] = b[key]
  }
  return a as any
}

export const splitOnFirst = (string: string, separator: string) => {
  if (separator === '') {
    return []
  }

  const separatorIndex = string.indexOf(separator)

  if (separatorIndex === -1) {
    return []
  }

  return [
    string.slice(0, separatorIndex),
    string.slice(separatorIndex + separator.length)
  ]
}
