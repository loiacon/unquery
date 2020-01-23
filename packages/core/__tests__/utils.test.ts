import { splitQuery, safeDecodeURI } from '../src/utils'
import warn from '../src/utils/warn'

describe('test utils', () => {
  it('should split on first', () => {
    const foo = 'a=b=c'
    const splitted = splitQuery(foo)

    expect(splitted).toEqual(['a', 'b=c'])
  })

  it('should return empty array when separator is not found', () => {
    const foo = 'a.b.c'
    const splitted = splitQuery(foo)

    expect(splitted).toEqual([])
  })

  it('should warn correctly', () => {
    global.console.warn = jest.fn()

    const warningStr = 'This is dangerous!'
    warn(warningStr)

    expect(global.console.warn).toHaveBeenCalledTimes(1)
  })

  it('should decode uri', () => {
    const decoded = safeDecodeURI('%D1%88%D0%B5%D0%BB%D0%BB%D1%8B')
    const decoded2 = safeDecodeURI('normalValue')
    const malformedURI = safeDecodeURI('%C3%')

    expect(decoded).toBe('шеллы')
    expect(decoded2).toBe('normalValue')
    expect(malformedURI).toBe('%C3%')
  })
})
