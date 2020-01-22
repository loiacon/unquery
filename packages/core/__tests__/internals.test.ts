import { provideOption, unqueryOptions } from '../src/unqueryOptions'
import formatPrimitive from '../src/formatPrimitive'
import { UnqueryType } from '../src/types'

describe('internals should work', () => {
  it('should provide option', () => {
    const arrayFormat = provideOption('arrayFormat')

    expect(arrayFormat).toBe(unqueryOptions.arrayFormat)
  })

  it('should get secondary option when first is not available', () => {
    const pattern = provideOption('parsePattern', 'pattern')

    expect(pattern).toBe(unqueryOptions.pattern)
  })

  it('should get primary option when available', () => {
    unqueryOptions.encodePattern = 'DD/MM/YYYY'
    const pattern = provideOption('encodePattern', 'pattern')

    expect(pattern).toBe(unqueryOptions.encodePattern)
  })

  it('should return null when no option is available', () => {
    const option = provideOption()

    expect(option).toBe(null)
  })

  it('should return value when format primitive type not exists', () => {
    const value = formatPrimitive('foo=1', { type: 999 })

    expect(value).toBe('foo=1')
  })

  it('should use default pattern when it not exists', () => {
    const value = formatPrimitive('1992-02-10', { type: UnqueryType.date })

    expect(value).toEqual(new Date('1992-02-10'))
  })

  it('should parse date with correct pattern', () => {
    const value = formatPrimitive('10/02/1992', {
      type: UnqueryType.date,
      pattern: 'DD/MM/YYYY '
    })

    expect(value).toEqual(new Date('1992-02-10'))
  })
})
