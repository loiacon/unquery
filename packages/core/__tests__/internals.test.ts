import { provideOption, unqueryOptions } from '../src/unqueryOptions'
import formatPrimitive from '../src/formatPrimitive'

describe('internals should work', () => {
  it('should provide option', () => {
    const arrayFormat = provideOption('arrayFormat')

    expect(arrayFormat).toBe(unqueryOptions.arrayFormat)
  })

  it('should return null when no option is available', () => {
    const option = provideOption()

    expect(option).toBe(null)
  })

  it('should use second value when valid', () => {
    const option = provideOption('toGetSecondValue' as never, 'arrayFormat')

    expect(option).toBe(unqueryOptions.arrayFormat)
  })

  it('should return value when format primitive type not exists', () => {
    const value = formatPrimitive('foo=1', { type: 999 })

    expect(value).toBe('foo=1')
  })
})
