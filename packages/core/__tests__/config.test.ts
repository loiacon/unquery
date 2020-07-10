import { Unquery, stringify, setOptions } from '..'

describe('Unquery config', () => {
  it('should parse with skipNull as false', () => {
    const toParse = '?'
    const unquery = Unquery(
      toParse,
      { someNull: Unquery.string() },
      { skipNull: false }
    )

    expect(unquery).toEqual({
      someNull: null,
    })
  })

  it('should parse with skipNull as true', () => {
    const toParse = '?'
    const unquery = Unquery(
      toParse,
      { someNull: Unquery.string() },
      { skipNull: true }
    )

    expect(unquery).toEqual({})
  })

  it('should parse with skipUnknown as false', () => {
    const toParse = '?someValue=123&unknownQuery=456'
    const unquery = Unquery(
      toParse,
      { someValue: Unquery.string() },
      { skipUnknown: false }
    )

    expect(unquery).toEqual({
      someValue: '123',
      unknownQuery: '456',
    })
  })

  it('should parse with skipUnknown as true', () => {
    const toParse = '?someValue=123&unknownQuery=456'
    const unquery = Unquery(
      toParse,
      { someValue: Unquery.string() },
      { skipUnknown: true }
    )

    expect(unquery).toEqual({
      someValue: '123',
    })
  })

  it('should get new global config', () => {
    const toParse = '?foo[0]=bar&foo[1]=123&unknown=baz'
    setOptions({
      arrayFormat: 'index',
      skipUnknown: false,
    })

    const unquery = Unquery(toParse, {})
    const unquery2 = Unquery(toParse, {
      // "Wrong" value to test compatibility with
      // another type. It should always get the last value
      foo: Unquery.string(),
    })

    expect(unquery).toEqual({
      foo: ['bar', '123'],
      unknown: 'baz',
    })
    expect(stringify(unquery)).toBe('foo[0]=bar&foo[1]=123&unknown=baz')
    expect(stringify(unquery, { arrayFormat: 'comma' })).toBe(
      'foo=bar,123&unknown=baz'
    )
    expect(stringify(unquery, { arrayFormat: 'none' })).toBe(
      'foo=bar&foo=123&unknown=baz'
    )
    expect(unquery2).toEqual({
      foo: '123',
      unknown: 'baz',
    })
  })
})
