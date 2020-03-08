import { UnqueryType, UnqueryTypeReturn } from './types'
import { safeDecodeURI } from './utils'

function formatPrimitive(value: string, { type }: UnqueryTypeReturn) {
  if (value == null) {
    return null
  }

  value = safeDecodeURI(value)
  if (type & UnqueryType.STRING) {
    return `${value}`
  }

  if (type & UnqueryType.NUMBER) {
    return value !== '' ? +value : null
  }

  if (type & UnqueryType.BOOL) {
    return Boolean(value)
  }

  return value
}

export default formatPrimitive
