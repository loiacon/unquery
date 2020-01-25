import { stringify } from '..'

describe('stringify', () => {
  it('should stringify objects', () => {
    const obj = { a: 1, b: 2 }
    const stringfied = stringify(obj)

    expect(stringfied).toBe('a=1&b=2')
  })

  it('should stringify strings', () => {
    const str = '?foo=1&bar=2'
    const stringfied = stringify(str)

    expect(stringfied).toBe('foo=1&bar=2')
  })

  it('should ignore null at objects', () => {
    const obj = { foo: 1, bar: [1, 2, 3], baz: null }
    const stringfied = stringify(obj)
    const stringfied2 = stringify(obj, { arrayFormat: 'bracket' })

    expect(stringfied).toBe('foo=1&bar=1&bar=2&bar=3')
    expect(stringfied2).toBe('foo=1&bar[]=1&bar[]=2&bar[]=3')
  })

  it('should ignore empty array', () => {
    const obj = { foo: 1, bar: [], baz: null }
    const stringfied = stringify(obj, { arrayFormat: 'comma' })
    expect(stringfied).toBe('foo=1')
  })

  it('should stringify with falsy key values', () => {
    const obj = { 0: 0, 1: 2, 2: 4 }
    const stringified = stringify(obj)

    expect(stringified).toBe('0=0&1=2&2=4')
  })
})
